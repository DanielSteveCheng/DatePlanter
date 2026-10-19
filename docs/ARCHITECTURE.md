# Architecture

Date Planter is an Electron app. The **main process** (`electron/`, Node) owns the window, settings and
storage. The **renderer** (`src/`, React + Tailwind) is the UI. They talk only through a small API that
`electron/preload.cjs` exposes as `window.dateplanter`.

## Where things live

```
electron/                  main process
  main.cjs                 app start: data folder, single instance, window, wiring
  preload.cjs              the window.dateplanter API (garden, settings, window)
  ipc.cjs                  routes API calls to the active store and window helpers
  settings.cjs             settings.json (incl. a random per-computer deviceId)
  windowSizing.cjs         ratio-locked resizing and UI zoom
  miniMode.cjs             pot mode: click-through window, dragging the pot
  onTop.cjs                "keep on top" behaviour
  identify.cjs             Date Planter User-Agent for map tiles and place search
  externalLinks.cjs        opens web links in the browser, never in the app window
  storage/
    index.cjs              picks a backend from settings
    garden.cjs             shared helpers: normalizing, upserts, change detection
    fileStore.cjs          JSON file (local or in a synced folder)
    supabaseStore.cjs      Supabase REST
src/                       renderer
  main.jsx                 entry: fonts, CSS, BridgeProvider, <App>
  App.jsx                  top level: data hooks, startup/loading, pot mode (WindowShell)
  GardenApp.jsx            the open app: frame, sky, vine, soil, cards and panels
  api/                     bridge to the main process + an in-memory stand-in
  hooks/                   app-wide React hooks (data, settings, weather, inbox, dev mode)
  lib/                     pure logic, no React (dates, weather, vine, stats, messages…)
  components/              UI, one folder per area:
    frame/                 window chrome, title bar, pot, loading, resize grip
    sky/                   sky, weather effects, weather readout
    vine/                  vine, stem, leaves, bud, scrolling
    dates/                 date card, form, details, location field
    places/                shared place search (dates' "Where" and the weather location)
    soil/                  notes pad and ADD DATE! button
    messages/              send panel, message bud, bubble, replies
    settings/  stats/  map/  dev/
    ui/                    shared building blocks (controls, Panel, CardHeader, SpeechBubble…)
  sprites/                 sprite slots: registry, sizes, <Sprite>, <Surface>, default art
  styles/theme.css         design tokens: colours, text sizes, font, animations
  assets/sprites/          your custom sprite files
scripts/
  render-icon.cjs          renders build/icon.png for the installer
  partner.cjs              `npm run partner`: a second window acting as the other computer
docs/                      this file, CUSTOMIZING.md, supabase.sql
```

Conventions:

- **`lib/` is pure.** Anything with rules or maths (layout, physics, parsing, stats) lives there as
  plain functions with tests next to them (`*.test.js`). Components stay thin.
- **Hooks used by one component live next to it** (e.g. `components/vine/useMomentumScroll.js`).
  `src/hooks/` holds the ones shared across the app.
- **Tunable numbers are named config objects** at the top of their module (`STEM`, `WIND`,
  `MOMENTUM`, `SPRITE_SIZES`…). [`CUSTOMIZING.md`](CUSTOMIZING.md) lists them all.

## Process boundary

The UI never touches the file system or credentials. It calls `window.dateplanter`:

- `garden.load / upsertDate / deleteDate / saveNotes / upsertMessage / onChange / onError`
- `settings.get / update / chooseFolder`
- `window.close / collapse / expand / setPotHover / beginDrag / endDrag / onPotMoved / beginResize / endResize`

`src/api/memoryBridge.js` implements the same API in memory, so the UI also runs in a plain browser
(`npx vite`). `main.jsx` provides the bridge through `BridgeProvider`, so a test can swap in a fake.

## Data

Everything shared lives in one **garden** document:

```js
{
  dates: [{ id, title, where, place, when, type, activities, notes, author, createdAt, updatedAt }],
  notes: '',
  messages: [{ id, text, from: { deviceId, name }, replyTo, createdAt, readAt }],
}
```

- Ids are client-generated UUIDs, so records can be created offline.
- `when` is a local `datetime-local` string, so it sorts as text.
- `place` is `null` or `{ id, label, address, latitude, longitude }` when a search suggestion was
  picked. `where` is always the display text, so typed-only locations still work.
- `dates` is stored unordered. The vine order is derived (`sortNewestFirst`), so two people never
  conflict over position.
- `replyTo` is `null`/absent, or a snapshot `{ id, text, name }` of the message being replied to, so the
  context survives even after the original is read and closed.

### Who receives a message

There's no recipient field. Each computer generates a random `deviceId` the first time it runs
(`electron/settings.cjs`), and every message records the sender's `deviceId`. A computer shows a
message as a bud when:

- the message's `from.deviceId` is **not** its own, and
- `readAt` is empty.

With two computers sharing a garden, that means "the other one". Closing (or replying to) the message
sets `readAt` in the shared garden, which removes the bud everywhere and shows **Read ✓** to the sender.
The logic is `unreadFor` in `src/lib/messages.js`.

Things that follow from this design:

- Any extra computer or profile sharing the garden is also a recipient (that's how `npm run partner`
  works). Whichever one closes the message first marks it read for all.
- A computer's `deviceId` lives in its settings file. Deleting that file, or starting with a fresh
  profile, creates a new id, and messages that computer sent earlier (and that are still unread) would
  then show up on it as if they were incoming.

### Storage backends

Both backends implement `load`, `upsertDate`, `deleteDate`, `saveNotes`, `upsertMessage`, `subscribe`
and `dispose`. Every mutation returns the full new garden, so the UI just replaces its state.

- **File store:** re-reads before every write (keeping edits that synced in from the other computer),
  writes atomically (temp file + rename), and polls with `fs.watchFile`, which works reliably in
  cloud-synced folders.
- **Supabase store:** plain `fetch` against PostgREST. Dates and messages are one row each with the
  record in a `jsonb` column, so adding fields never needs a migration. If the `messages` table is
  missing (an older setup), loading carries on without messages. Polls every 10 seconds.
- `createEmitter` notifies only when the content really changed, so your own writes don't echo back.

`upsertById`/`removeById` exist on both sides of the process boundary (`electron/storage/garden.cjs`
and `src/lib/list.js`) because the packaged main process can't import renderer code.

## App lifecycle

1. **Startup:** `App` shows the pot with a spinner (`WindowShell` phase `loading`). `useStartup`
   waits for settings and the garden, and for the weather up to 2 s. The last forecast is cached per
   day (`lib/forecastCache.js`), so later launches are ready in about half a second. `GardenApp` only
   mounts once data is ready, so nothing reshuffles on screen.
2. **Open:** the app grows out of the pot (`animate-grow`).
3. **Pot mode:** minimize shrinks the app into the pot. The window keeps its size but becomes
   click-through except over the pot (`miniMode.cjs`), because resizing a transparent window on
   Windows briefly flashes stale content. Dragging moves the window; `placePot` keeps it on screen
   and slides the pot inside it at edges.

## Messages UI

`MessageSprout` is the bud plus its bubble, used on the vine (between the first two leaves) and on the
pot. `placeBubble` (`src/lib/bubble.js`) positions the bubble inside the visible area, sliding it and
capping its height so it never runs off screen; the body scrolls if needed. `ReplyForm` and the send
panel share `useMessageDraft` for validation, sending and errors. `ReplyQuote` shows the replied-to
message, collapsed to one line, and expands on click.

Errors from storage are cleaned up by `readableError` (`src/lib/errors.js`); a missing Supabase table
becomes an instruction to run `docs/supabase.sql`.

## Rendering pieces

- **Weather:** `lib/weather.js` maps Open-Meteo codes to six conditions. Each condition's **scene**
  (`SCENES`) says which sky, bodies, particles, lightning and wind to show. Developer mode can force
  any condition (`activeCondition`).
- **Vine:** `lib/vine.js` lays leaves out as a pure function of their order. `lib/stem.js` draws the
  curved stem from a seeded noise function, so the shape is identical on both computers; leaves attach
  exactly at the stem's bend points. Scrolling is one GPU transform on a track holding the stem and
  leaves, driven by momentum physics (`lib/momentum.js`).
- **Places and map:** `lib/places.js` queries Photon (OpenStreetMap, free, no key). `PlaceSearch` is
  the shared search box for a date's *Where* and the weather location. `DateMap` renders OpenStreetMap
  tiles with Leaflet, one pin per place (`groupDatesByPlace`).
- **Stats:** `computeStats` derives everything the stats panel shows; rankings share `rankBy`.
- **Sprites:** `<Sprite slot>` and `<Surface slot>` use `src/assets/sprites/<slot>.*` when present,
  otherwise the default art. Sizes come from `sprites/sizes.js`. See [`CUSTOMIZING.md`](CUSTOMIZING.md).

## Developer mode

Ctrl+Shift+D (or ⚙ → Developer) toggles `settings.devMode`. The toolbar can force weather, outline
every sprite slot, and add **temporary** leaves and messages (`lib/devFixtures.js`). Those live only
in memory (`useLocalRecords`), are never saved or shared, and are recognised by their `dev-` id prefix
(`isDevRecord`).

## Testing

`npm test` runs Vitest over `src/lib`, hooks, the sprite registry, and every `electron/` module
(storage against a temp folder and a fake `fetch`, window maths as pure functions).
