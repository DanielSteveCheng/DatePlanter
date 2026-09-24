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
| `lightning`     | Flashes during thunderstorms                    |
| `leaf`          | A leaf holding a planned date                   |
| `leaf-sprout`   | The blank leaf at the top of the vine           |
| `leaf-selected` | The leaf whose date is currently open           |

Leaves are drawn pointing **right** with the stem attachment on the left edge;
left-side leaves are mirrored automatically.

## Texture slots (stretched over a surface's background)

`frame`, `titlebar`, `sky-clear`, `sky-overcast`, `stem`, `soil`, `soil-panel`,
`date-card`, `add-date-button`

## Colors, fonts and animation

Every default color, the font and the sway/rain animations are tokens in
`src/styles/theme.css`. Every themed element also carries a `data-slot`
attribute, so you can target it directly in CSS, e.g. `[data-slot="leaf"] { … }`.
