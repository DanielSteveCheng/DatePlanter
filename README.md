# Date Planter

A little desktop plant that grows a leaf for every date you plan together.

- Click the light-green **sprout** at the top of the vine (or **ADD DATE!**) to plant a new date.
- Click any leaf to see its details, edit, or delete it. Scroll over the vine to browse older leaves.
- The **Notes** box in the soil is a shared scratchpad for ideas.
- The sky follows today's weather (sunny, partly cloudy, cloudy, rain, thunder, snow).

## Getting started

```bash
npm install
npm run dev      # Vite + Electron with hot reload
npm test         # unit tests (Vitest)
npm start        # production build, run in Electron
npm run dist     # package an installer for the current OS (electron-builder)
```

Open ⚙ to set your name, a weather location, °F/°C and how you share the garden.

## Sharing between two computers

Pick one in ⚙ → Sharing, and set it up the same way on both computers.

**Shared folder (easiest).** If you already share a Dropbox, Google Drive, OneDrive or iCloud folder,
click **Pick** and choose it on both machines. The app keeps `date-planter.json` there and notices when
the other person's changes sync in (within a couple of seconds of the sync client finishing).

**Supabase (free hosted database).** Create a project at supabase.com, run
[`docs/supabase.sql`](docs/supabase.sql) in its SQL editor, then paste the project URL and the
`anon` public key into ⚙ on both computers. Changes show up on the other computer within ~10 seconds.

## Custom art

Every visual piece is a named slot. Drop `leaf.png`, `sun.png`, `sky-clear.png`, etc. into
`src/assets/sprites/` to replace it. Colors, font and animations live in `src/styles/theme.css`.
See [`src/assets/sprites/README.md`](src/assets/sprites/README.md) for the full slot list.

## How it's built

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
