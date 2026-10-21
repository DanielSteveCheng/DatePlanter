# Date Planter

A little desktop plant that grows a leaf for every date you plan together.

- **Plant a date:** click **ADD DATE!** (or the bud on an empty vine). The newest date is the top leaf.
- **See a date:** click any leaf to view, edit or delete it. Scroll over the vine to browse older ones.
- **Real places:** *Where* suggests real places ([Photon](https://photon.komoot.io), OpenStreetMap data,
  no key needed). Pick one to pin the date on the map, or keep whatever you typed.
- **Messages:** the ✉ button sends a message that blooms as a little bud on the other person's plant.
  Clicking the bud opens it; **Reply** answers right there (showing what you're replying to), and
  closing it marks it read. The ✉ panel shows your recent messages in both directions (with read
  status) and lets you delete any of them for both of you.
- **Notes:** the box in the soil is a shared scratchpad for ideas.
- **Weather:** the sky follows today's weather (sunny, partly cloudy, cloudy, rain, thunder, snow).
- **Stats and map:** ⚙ → **Stats** (favourite types, places, days…) and ⚙ → **Map** (every pinned date).
- **Pot mode:** the _ button shrinks the app into a little pot you can drag anywhere; click it to grow
  the app back. Messages appear on the pot too.
- **Resizing:** drag the bottom-right grip. The window keeps its shape and everything scales with it.

The first time each computer opens the garden, it asks **who it belongs to**. A garden is for two
people (say, Daniel and Rachel); each can use several computers. Messages go to the other *person*,
so they show up on all of their computers and never on your own.

Open ⚙ to change your name, weather location, °F/°C, keep-on-top, and how you share the garden.

## Getting started

```bash
npm install
npm run dev      # Vite + Electron with hot reload
npm test         # unit tests (Vitest)
npm start        # production build, run in Electron
npm run dist:win # Windows installer -> release/Date-Planter-Setup-<version>.exe (run on Windows)
npm run dist:mac # Mac disk image  -> release/Date-Planter-<version>-mac.dmg (run on a Mac)
npm run icon     # re-render build/icon.png from the pot sprite and theme colours
```

Changes to files in `electron/` need a restart of `npm run dev`; UI changes reload on their own.

## Installing

### Windows

Run `release/Date-Planter-Setup-<version>.exe`. It installs Date Planter for the current user and
adds Start menu and desktop shortcuts. The installer isn't code-signed, so Windows SmartScreen may warn
the first time: choose **More info → Run anyway**.

### Mac

Mac apps can only be built on a Mac, so there are two ways to get `Date-Planter-<version>-mac.dmg`:

- **Let GitHub build it (no Mac needed).** Push the project to GitHub, open the repository's
  **Actions** tab, pick **Build installers** and click **Run workflow**. When it finishes (about
  10 minutes), download **Date-Planter-mac** from the run's **Artifacts** section. It builds the
  Windows installer too (**Date-Planter-windows**). Pushing a version tag such as `v1.0.1` also runs it.
- **Build on the Mac.** Install [Node.js](https://nodejs.org) (LTS), copy the project over, then run
  `npm install` and `npm run dist:mac`.

The `.dmg` is one "universal" app that runs on both Apple Silicon and Intel Macs. To install it, open
the `.dmg` and drag **Date Planter** into **Applications**.

The app isn't signed with a paid Apple Developer certificate, so the first launch is blocked with a
message like *"Apple could not verify Date Planter is free of malware"*. To allow it once:

1. Try to open Date Planter, and click **Done** (or **Cancel**) on the warning.
2. Open **System Settings → Privacy & Security**, scroll down, and click **Open Anyway** next to the
   Date Planter message. Confirm with your password.

(Alternatively, in Terminal: `xattr -dr com.apple.quarantine "/Applications/Date Planter.app"`.)

On a Mac, shortcuts use **Cmd** where this README says Ctrl (e.g. Cmd+Shift+D for developer mode).

### Data and updates

The installed app keeps its data in `%APPDATA%\date-planter` on Windows and
`~/Library/Application Support/date-planter` on a Mac (the same folder `npm run dev` uses), so your
garden and settings carry over. To release a new version, bump `version` in `package.json` and build
again.

## Sharing between two computers

Pick one in ⚙ → Sharing, and set it up the same way on both computers. Dates, notes and messages are
all shared.

**Shared folder (easiest).** If you already share a Dropbox, Google Drive, OneDrive or iCloud folder,
click **Pick** and choose it on both machines. The app keeps `date-planter.json` there and notices when
the other person's changes sync in.

**Supabase (free hosted database).** Create a project at supabase.com, run
[`docs/supabase.sql`](docs/supabase.sql) in its SQL editor, then paste the project URL and the
publishable key (Project Settings → API Keys; the legacy `anon` key also works) into ⚙ → Sharing on
the first computer. Changes show up on the other computer within about 10 seconds. The script is safe
to run again, so re-run it after updates that add tables (messages need the `messages` table).

**Invite codes (no copying keys around).** On a computer that's already connected, open ⚙ → Sharing
and click **Copy invite code**, then send the code to the other person (text, email…). On a new
computer, paste it into **"Joining your partner's garden?"** on the first-run screen, or into ⚙ →
Sharing → **Or paste an invite code** (then Save). The code holds the project URL and key, so treat
it like the key itself and only share it with each other.

## Customizing the look

Every visual piece is a named sprite slot, and the rest of the look is in two files:

| Change | Where |
| --- | --- |
| Art for any piece (sky, border, sun, leaves, pot, icons…) | Drop `<slot>.png` into [`src/assets/sprites/`](src/assets/sprites/) |
| Sprite sizes, frame border and corners | [`src/sprites/sizes.js`](src/sprites/sizes.js) |
| Colours, font, text sizes, animations | [`src/styles/theme.css`](src/styles/theme.css) |

The full guide, with every slot name, what it's for, what size to draw it and where to tweak it, is
in [`docs/CUSTOMIZING.md`](docs/CUSTOMIZING.md).

## Developer tools

- **Developer mode** (Ctrl+Shift+D, or ⚙ → Developer) adds a toolbar to force any weather, outline
  every sprite slot, and add or clear temporary leaves and messages. These are never saved or shared.
- **Partner window** (to test sharing and messages on one computer): with `npm run dev` running, run
  `npm run partner` in a second terminal. It opens another window with its own profile in
  `.profiles/partner`, set up with your sharing settings, so it behaves like another computer. It
  shares your real garden, so when it asks who it belongs to, choose the other person (e.g. create
  "Rachel" if she hasn't set up yet; she can pick "Rachel" on her own Mac later). Delete that folder
  to start the partner fresh.

## How it's built

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
