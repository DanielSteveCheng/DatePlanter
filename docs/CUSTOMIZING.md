# Customizing the look

Everything visual in Date Planter can be restyled from four places. You never need to touch a component
to swap art.

| What you want to change | Where |
| --- | --- |
| **Art**: replace any picture or background with your own image | Drop a file into [`src/assets/sprites/`](../src/assets/sprites/) |
| **Sizes**: how big each sprite is, frame border and corner rounding | [`src/sprites/sizes.js`](../src/sprites/sizes.js) |
| **Colours, font, text sizes, animations** | [`src/styles/theme.css`](../src/styles/theme.css) |
| **Where things sit**: sky layouts, vine shape, weather effects | See [Positions and behaviour](#positions-and-behaviour) |

## Adding your own sprite

1. Draw the image. PNG with transparency is best; `.webp`, `.svg`, `.jpg` and `.gif` also work.
2. Name the file after its slot from the tables below, e.g. `leaf.png`, `sky-clear.png`, `mini-pot.png`.
3. Put it in `src/assets/sprites/`.
4. Run `npm run dev`. If it was already running and the new art doesn't show, restart it.
5. Tweak its size in `src/sprites/sizes.js` if needed.
6. When you're happy, run `npm run dist:win` (or `npm run dist:mac` for mac) to build a new installer that includes your art.

To go back to the built-in art, delete (or rename) your file.

**Checking your work:** turn on developer mode (**Ctrl+Shift+D**) to switch between every weather
instantly, add test leaves and messages, and click **Slots** to outline every customizable piece. If a
file in `src/assets/sprites/` doesn't match any slot name, the dev console lists it with the valid names.

### Two kinds of slot

- **Image slots** replace a picture (the sun, a leaf, an icon). Your image keeps its shape and is drawn
  at the size set in `sizes.js`. When a size is a single number, that's the width and the height
  follows your image's proportions.
- **Texture slots** fill a surface (the sky, the soil, a card). Your image is stretched to exactly fill
  that area, so draw it at the size listed below. When there's no texture, the surface is filled with
  its colour from `theme.css`.

Sizes below are at the default window size (380×540). Resizing the window scales everything evenly, so
these proportions always hold.

## Slot catalog

### Window and frame

| Slot | Kind | What it is | Draw at | Notes |
| --- | --- | --- | --- | --- |
| `frame` | texture | The whole window background, behind everything | 368×528 | Corners are rounded by `frame-radius`. The border is drawn on top in `--color-frame-edge`, `frame-border` px wide. Set `frame-border` to `0` if your art has its own border. |
| `titlebar` | texture | Strip at the top with "Date Planter" | 360×36 | Title colour: `--color-titlebar-text`, size: `--text-titlebar` |
| `icon-message` | image | Title bar button: send a message | square | Size: `title-icon` (button box: `title-button`) |
| `icon-settings` | image | Title bar button: settings | square | Built-in icons are drawn in `--color-titlebar-text`; your images keep their own colours. |
| `icon-minimize` | image | Title bar button: collapse to the pot | square | |
| `icon-close` | image | Close buttons (title bar, cards, panels, bubbles) | square | |
| `icon-delete` | image | Trash button on messages in the ✉ panel | square | |
| `resize-grip` | image | Bottom-right drag handle | 16×16 | Size: `resize-grip` |

### Sky and weather

| Slot | Kind | What it is | Draw at | Notes |
| --- | --- | --- | --- | --- |
| `sky-clear` | texture | Sky for sunny and partly cloudy | 340×356 | Colour: `--color-sky-clear` |
| `sky-overcast` | texture | Sky for cloudy, rain and thunder | 340×356 | Colour: `--color-sky-overcast` |
| `sky-snow` | texture | Sky for snow | 340×356 | Colour: `--color-sky-snow` |
| `sun` | image | The sun | square | Size: `sun` |
| `cloud` | image | The cloud (alone, or next to the sun) | wide | Size: `cloud` |
| `backdrop-cloud` | image | Drifting background clouds in cloudy weather | wide | Sizes, heights, speeds and faintness per layer: `BACKDROP_CLOUDS` in `src/lib/backdrop.js`. Randomly mirrored. |
| `cloud-bolt` | image | Bolt hanging under the cloud during thunder | tall | Size: `cloud-bolt` |
| `cloud-snowflake` | image | Snowflake under the cloud during snow (slowly turns) | square | Size: `cloud-snowflake` |
| `lightning` | image | Big background strikes during thunder | tall | Size: `lightning`. Randomly mirrored. |
| `raindrop` | image | Falling rain particle | tiny, tall | Size: `raindrop` (each drop varies ±30%) |
| `snowflake` | image | Falling snow particle | tiny | Size: `snowflake` (each flake varies ±50%) |

The weekday and temperatures use `--color-sky-text` and `--text-day`, `--text-temp`, `--text-sky-hint`.

### Vine

| Slot | Kind | What it is | Draw at | Notes |
| --- | --- | --- | --- | --- |
| `leaf` | image | A leaf holding a date | 64 wide | **Point it right**, with the stem attaching at the middle of the left edge. Left-side leaves are mirrored for you. |
| `leaf-selected` | image | The leaf whose date is open | 64 wide | Same shape rules as `leaf` |
| `bud` | image | Bud on the half-grown vine when there are no dates yet | 40 wide | Its bottom sits on the stem tip |
| `bud-bubble` | texture | The "Plant a Date!" hover bubble | small pill | Colours: `--color-bubble-fill`, `--color-bubble-ink` |

The stem itself is drawn from a calculated path rather than an image, so leaves always sit on it. Its
colour is `--color-stem`; its thickness, curviness and twists are in `STEM` (see below).

### Soil

| Slot | Kind | What it is | Draw at | Notes |
| --- | --- | --- | --- | --- |
| `soil` | texture | Brown ground strip at the bottom | 340×112 | Colour: `--color-soil` |
| `soil-panel` | texture | The shared Notes box | 226×88 | Colour: `--color-soil-panel`, text: `--color-soil-text` |
| `add-date-button` | texture | The ADD DATE! button | 80×88 | Text size: `--text-add-date` |

### Cards, panels and scrolling

| Slot | Kind | What it is | Draw at | Notes |
| --- | --- | --- | --- | --- |
| `date-card` | texture | The card for a date (new, view, edit) | 177 wide | Colours: `--color-card`, `--color-card-field`, `--color-card-text`, `--color-card-accent` |
| `panel` | texture | Settings, Stats, Map and Send a message panels | 360×484 | Same card colours |
| `scroll-track` | texture | Custom scroll bar track | thin, tall | Width: `scroll-bar`. Colour: `--color-scroll-track` |
| `scroll-thumb` | texture | Custom scroll bar handle | thin, tall | Colour: `--color-scroll-thumb` |

### Messages

| Slot | Kind | What it is | Draw at | Notes |
| --- | --- | --- | --- | --- |
| `message-bud` | image | Bud that appears when a message arrives | 18×24 | Colours: `--color-message-bud`, `--color-message-heart` |
| `message-bubble` | texture | Speech bubble showing the message and the reply box | 200 wide | Width: `message-bubble`. Colours: `--color-bubble-fill`, `--color-bubble-ink`. The "Replying to" quote can be styled with `[data-slot="message-quote"]`. |

### Pot mode and loading

| Slot | Kind | What it is | Draw at | Notes |
| --- | --- | --- | --- | --- |
| `mini-pot` | image | The pot the window collapses into, also shown while loading | 80×96 | Size: `mini-pot`. If your sprout isn't at the top middle, move `message-bud-on-pot` in `SPRITE_ANCHORS`. |
| `loading-spinner` | image | Spinner above the pot while the app starts | square | Rotated for you. Colours: `--color-spinner`, `--color-spinner-track` |
| `loading-message` | texture | Bubble with the loading message above the spinner | small pill | Colours: `--color-bubble-fill`, `--color-bubble-ink` |

The loading messages ("Planting…", "Watering…") are listed in
[`src/lib/loadingMessages.js`](../src/lib/loadingMessages.js).

### Map

| Slot | Kind | What it is | Draw at | Notes |
| --- | --- | --- | --- | --- |
| `map-pin` | image | Pin for a place on the date map | 28×36 | The tip must be at the bottom centre. Colours: `--color-pin`, `--color-pin-edge`, `--color-pin-ink` |

### App icon

The installer and desktop shortcut use `build/icon.png`. Run `npm run icon` to re-render it from your
`mini-pot` sprite (or the built-in pot in your theme colours), or replace `build/icon.png` with any
512×512 PNG.

## Colours, fonts and animations

[`src/styles/theme.css`](../src/styles/theme.css) holds every design token, grouped by area:

- `--font-display`: the font (Quicksand).
- `--text-*`: every text size, each with a matching line height.
- `--color-*`: every colour, named after where it's used, like the slots above.
- `--animate-*` and the `@keyframes` below them: leaf sway, falling rain, lightning flash, sprouting,
  cloud drift, the pot's shrink/grow and more.

Every customizable element also carries a `data-slot="…"` attribute, so you can target it with CSS,
e.g. `[data-slot="leaf"] { filter: saturate(1.2); }`.

## Positions and behaviour

| What | Where |
| --- | --- |
| Where the sun, cloud, bolt and snowflake sit in each weather | `LAYOUTS` in [`src/components/sky/CelestialBodies.jsx`](../src/components/sky/CelestialBodies.jsx) |
| Which weather uses which sky, bodies, rain/snow, lightning and wind | `SCENES` in [`src/lib/weather.js`](../src/lib/weather.js) |
| How hard leaves and the vine sway in each wind | `WIND` in [`src/lib/weather.js`](../src/lib/weather.js) |
| Rain and snow amount, speed, drift and spawn height | `PRECIPITATION` in [`src/lib/precipitation.js`](../src/lib/precipitation.js) |
| Background cloud layers (how many, size, height, speed, faintness) | `BACKDROP_CLOUDS` in [`src/lib/backdrop.js`](../src/lib/backdrop.js). Turn them on for other weather with `backdrop: 'clouds'` in `SCENES`. |
| Lightning timing and flash length | `LIGHTNING` in [`src/lib/lightning.js`](../src/lib/lightning.js) |
| Vine position, width and leaf spacing | `VINE_LAYOUT` in [`src/lib/vine.js`](../src/lib/vine.js) |
| Stem thickness, curviness, twist frequency and size | `STEM` in [`src/lib/stem.js`](../src/lib/stem.js) |
| Scroll momentum (glide length, friction) | `MOMENTUM` in [`src/lib/momentum.js`](../src/lib/momentum.js) |
| Loading screen timing | `STARTUP` in [`src/lib/startup.js`](../src/lib/startup.js) |
| Message bubble spacing from its bud and the screen edges | `BUBBLE_LAYOUT` in [`src/lib/bubble.js`](../src/lib/bubble.js) |
