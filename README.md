# Date Planter

A little desktop plant that grows a leaf for every date you plan together.

- Click **ADD DATE!** to plant a new date. The newest date is the top leaf of the vine.
- Click any leaf to see its details, edit, or delete it. Scroll over the vine to browse older leaves.
- The **Notes** box in the soil is a shared scratchpad for ideas.
- The sky follows today's weather (sunny, partly cloudy, cloudy, rain, thunder, snow).

## Getting started

```bash
npm install
npm run dev      # Vite + Electron with hot reload
npm test         # unit tests (Vitest)
npm start        # production build, run in Electron
npm run dist     # build the Windows installer -> release/Date-Planter-Setup-<version>.exe
npm run icon     # re-render build/icon.png from the pot sprite and theme colours
```

## Installing

Run `release/Date-Planter-Setup-<version>.exe` on each computer. It installs Date Planter for the
current user and adds Start menu and desktop shortcuts. The installer isn't code-signed, so Windows
SmartScreen may warn the first time: choose **More info → Run anyway**. The installed app uses the same
data folder as `npm run dev` (`%APPDATA%\date-planter`), so your garden and settings carry over.
To release a new version, bump `version` in `package.json` and run `npm run dist` again.

Open ⚙ to set your name, a weather location, °F/°C and how you share the garden. ⚙ → **Stats** shows
counts, favorite types, places, days and more. ⚙ → **Map** pins every date that has a real place.

When planting a date, *Where* suggests real places (via [Photon](https://photon.komoot.io), OpenStreetMap
data, no key needed), biased toward your weather location. Pick one to pin the date on the map, or keep
whatever you typed.

Drag the bottom-right grip to resize. The window keeps its shape and everything scales with it.

**Developer mode** (Ctrl+Shift+D, or ⚙ → Developer) adds a toolbar to force any weather and to
outline every sprite slot.

To run a second, independent copy (e.g. to test sharing), point it at another data folder:
`DATE_PLANTER_PROFILE=./profile-b npm start`.

## Sharing between two computers

Pick one in ⚙ → Sharing, and set it up the same way on both computers.

**Shared folder (easiest).** If you already share a Dropbox, Google Drive, OneDrive or iCloud folder,
click **Pick** and choose it on both machines. The app keeps `date-planter.json` there and notices when
the other person's changes sync in (within a couple of seconds of the sync client finishing).

**Supabase (free hosted database).** Create a project at supabase.com, run
[`docs/supabase.sql`](docs/supabase.sql) in its SQL editor, then paste the project URL and the
publishable key (Project Settings → API Keys; the legacy `anon` key also works) into ⚙ on both computers. Changes show up on the other computer within ~10 seconds.

## Custom art

Every visual piece is a named slot. Drop `leaf.png`, `sun.png`, `sky-clear.png`, etc. into
`src/assets/sprites/` to replace it. Colors, font and animations live in `src/styles/theme.css`.
See [`src/assets/sprites/README.md`](src/assets/sprites/README.md) for the full slot list.

## How it's built

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
