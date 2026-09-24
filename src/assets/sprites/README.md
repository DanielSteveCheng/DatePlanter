# Custom sprites

Drop an image in this folder named after a slot and it replaces the built-in art —
no code changes needed. Supported: `.png .jpg .jpeg .gif .webp .svg`.
Restart `npm run dev` after adding a new file.

## Image slots (replace the default SVG)

| Slot            | Where it shows                                  |
| --------------- | ----------------------------------------------- |
| `sun`           | Sunny / partly-cloudy sky                       |
| `cloud`         | Partly / cloudy / rain / thunder / snow sky     |
| `raindrop`      | Falling particle for rain and thunder           |
| `snowflake`     | Falling particle for snow                       |
| `lightning`     | Background strikes during thunderstorms         |
| `cloud-bolt`    | Bolt hanging under the cloud during thunder     |
| `cloud-snowflake` | Snowflake icon under the cloud during snow    |
| `leaf`          | A leaf holding a planned date                   |
| `leaf-selected` | The leaf whose date is currently open           |
| `bud`           | Bud on the half-grown vine before any dates     |
| `mini-pot`      | The pot the window collapses into on minimize   |
| `icon-settings`, `icon-minimize`, `icon-close` | Title bar buttons (square; drawn in `--color-titlebar-text` by default) |
| `map-pin`       | Pin for a place on the date map (28×36, tip at bottom centre) |
| `resize-grip`   | Bottom-right corner handle for resizing          |

Leaves are drawn pointing **right** with the stem attachment on the left edge;
left-side leaves are mirrored automatically.

## Texture slots (stretched over a surface's background)

`frame`, `titlebar`, `sky-clear`, `sky-overcast`, `sky-snow`, `soil`, `soil-panel`,
`date-card`, `add-date-button`, `panel` (settings/stats), `scroll-track`, `scroll-thumb`, `bud-bubble` (the "Plant a Date!" bubble)

## Colors, fonts and animation

Every default color, font size (`--text-*`), the font and the sway/rain animations
are tokens in `src/styles/theme.css`. Vine position and leaf spacing are in
`VINE_LAYOUT` (`src/lib/vine.js`).

Turn on developer mode (Ctrl+Shift+D) to switch weather instantly and outline
every slot with **Slots**. Every themed element also carries a `data-slot`
attribute, so you can target it directly in CSS, e.g. `[data-slot="leaf"] { … }`.

## The stem

The stem is drawn from a calculated path rather than an image, so leaves always sit on it.
Its shape (bend size, twist frequency and size, thickness, and the `seed` that picks the
pattern) is `STEM` in `src/lib/stem.js`; its color is `--color-stem`. Target it in CSS with
`[data-slot="stem"]`.
