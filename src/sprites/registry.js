import * as Defaults from './defaults';

export const IMAGE_SLOTS = {
  sun: Defaults.Sun,
  cloud: Defaults.Cloud,
  'backdrop-cloud': Defaults.Cloud,
  raindrop: Defaults.Raindrop,
  snowflake: Defaults.Snowflake,
  lightning: Defaults.Lightning,
  'cloud-bolt': Defaults.Lightning,
  'cloud-snowflake': Defaults.SnowflakeIcon,
  leaf: Defaults.Leaf,
  'leaf-selected': Defaults.LeafSelected,
  bud: Defaults.Bud,
  'message-bud': Defaults.MessageBud,
  'mini-pot': Defaults.MiniPot,
  'loading-spinner': Defaults.LoadingSpinner,
  'icon-message': Defaults.IconMessage,
  'icon-settings': Defaults.IconSettings,
  'icon-minimize': Defaults.IconMinimize,
  'icon-close': Defaults.IconClose,
  'icon-delete': Defaults.IconDelete,
  'resize-grip': Defaults.ResizeGrip,
};

const TEXTURE_SLOTS = [
  'frame',
  'titlebar',
  'sky-clear',
  'sky-overcast',
  'sky-snow',
  'soil',
  'soil-panel',
  'date-card',
  'add-date-button',
  'scroll-track',
  'scroll-thumb',
  'panel',
  'bud-bubble',
  'message-bubble',
  'loading-message',
];

const DOM_SLOTS = ['map-pin'];

export const ALL_SLOTS = [...Object.keys(IMAGE_SLOTS), ...TEXTURE_SLOTS, ...DOM_SLOTS];

const customFiles = import.meta.glob('../assets/sprites/*.{png,jpg,jpeg,gif,webp,svg}', {
  eager: true,
  import: 'default',
});

const slotNameFromPath = (filePath) => filePath.split('/').pop().replace(/\.[^.]+$/, '');

export function buildCustomSpriteMap(files) {
  return Object.fromEntries(Object.entries(files).map(([filePath, url]) => [slotNameFromPath(filePath), url]));
}

export const unknownSpriteNames = (spriteMap, known = ALL_SLOTS) =>
  Object.keys(spriteMap).filter((name) => !known.includes(name));

const customSprites = buildCustomSpriteMap(customFiles);

if (import.meta.env?.DEV) {
  const unknown = unknownSpriteNames(customSprites);
  if (unknown.length) {
    console.warn(`Unused sprite files in src/assets/sprites (no slot with that name): ${unknown.join(', ')}.
Valid names: ${ALL_SLOTS.join(', ')}`);
  }
}

export const customSpriteUrl = (slot) => customSprites[slot] ?? null;
