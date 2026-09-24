# Architecture

```
electron/                 main process (Node): window, settings, storage
  main.cjs                creates the frameless window
  preload.cjs             exposes the window.dateplanter API to the UI
  ipc.cjs                 routes API calls to the active store; swaps stores when settings change
  settings.cjs            settings.json in the OS app-data folder
  storage/
    garden.cjs            pure helpers shared by every backend
    fileStore.cjs         JSON file backend (local or synced folder)
    supabaseStore.cjs     Supabase REST backend
    index.cjs             picks a backend from settings
src/                      renderer (React + Tailwind)
  api/                    bridge to the main process, plus an in-memory stand-in
  lib/                    pure logic: dates, weather, vine layout, selection state
  hooks/                  React glue around lib/ and the bridge
  sprites/                slot registry, <Sprite>, <Surface>, default SVG art
  components/             UI, one folder per region (frame, sky, vine, dates, soil, settings)
  styles/theme.css        design tokens (colors, font, keyframes)
```

## Process boundary

The UI never touches the file system or network credentials. It calls a small async API
(`garden.*`, `settings.*`, `window.*`) exposed by `preload.cjs`. `src/api/memoryBridge.js` implements
the same API in memory, so the UI also runs in a plain browser (`npx vite`) and in tests. Components
get the bridge from `BridgeContext`, so a test can provide a fake one.

## Data model

The whole shared state is one **garden** document:

```js
{
  dates: [{ id, title, where, when, type, activities, notes, author, createdAt, updatedAt }],
  notes: '',
}
```

- `id` is a client-generated UUID, so a date can be created offline without asking a server.
- `when` is an ISO local datetime string (from `<input type="datetime-local">`), so it sorts as text.
- `dates` is stored **unordered**. The vine's order is derived (`sortNewestFirst`: by `when`, then
  `createdAt`). This way two people never conflict over position.
- To add a field, add it to `DATE_FIELDS` / `emptyDateFields` in `src/lib/dates.js` and to `DateForm`.
  No storage changes are needed.

## Storage backends

Every backend implements:

```
load() → garden
upsertDate(date) → garden
deleteDate(id) → garden
saveNotes(text) → garden
subscribe(listener) → unsubscribe
dispose()
```

Mutations return the full new garden, so the UI replaces its state and never merges. To add a backend
(Firebase, your own server…), write one module with this shape and select it in `storage/index.cjs`.

**File store.** Reads the file before every mutation, so it keeps edits that synced in from the other
computer. Writes are atomic (temp file + rename), so sync clients never upload a half-written file.
Remote edits are detected with `fs.watchFile` polling, which is more reliable than native watch events
on cloud-synced folders. Upserts are per-date, but two edits within the same sync window can still
race. The last full-file write wins.

**Supabase store.** Plain `fetch` against the PostgREST API (`fetchImpl` is injectable for tests).
Each date is one row with the record in a `jsonb` column, so the schema never needs migrations.
Saves are row-level upserts, so two people editing different dates never clash. Polls every 10 seconds.

**Change detection.** `createEmitter` remembers the last serialized garden and notifies only when the
content differs. Your own writes don't echo back, and quiet polls cause no re-renders.

## Weather

`src/lib/weather.js` is pure and data-driven. Open-Meteo (free, no key) returns a WMO weather code,
`conditionFromCode` maps it to one of six conditions, and `SCENES` maps each condition to what the sky
draws (`sky`, `bodies`, `precipitation`, `lightning`). To add a condition, add one row plus any new
sprite. ⚙ → *Preview weather* forces a condition, which helps when designing art.

## Vine

`src/lib/vine.js` lays leaves out as a pure function of `(ids, scroll)`: slot 0 is the blank sprout,
then dates newest-first, alternating sides, each `spacing` px lower. Leaves are keyed by id and animate
their `top`. When a date is planted, every older leaf slides down one slot ("the vine grows"), and the
new leaf plays a sprout animation (`useNewIds`).

## Sprites and theming

- `<Sprite slot="…">` shows `src/assets/sprites/<slot>.<ext>` if present, otherwise the default SVG.
- `<Surface slot="…">` does the same for background textures.
- `import.meta.glob` discovers the files at build time, so adding art needs no code.
- Default SVGs are colored with theme variables, so recoloring only means editing `theme.css`.
- Every themed element has a `data-slot` attribute for targeted CSS.

## Testing

`npm test` runs Vitest over `src/lib`, the sprite registry and the storage backends (the file store
against a temp directory, Supabase against a fake `fetch`).
