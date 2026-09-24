import * as Defaults from './defaults';

export const IMAGE_SLOTS = {
  sun: Defaults.Sun,
  cloud: Defaults.Cloud,
  raindrop: Defaults.Raindrop,
  snowflake: Defaults.Snowflake,
  lightning: Defaults.Lightning,
  'cloud-bolt': Defaults.Lightning,
  'cloud-snowflake': Defaults.SnowflakeIcon,
  leaf: Defaults.Leaf,
  'leaf-selected': Defaults.LeafSelected,
  bud: Defaults.Bud,
  'mini-pot': Defaults.MiniPot,
  'loading-spinner': Defaults.LoadingSpinner,
  'icon-settings': Defaults.IconSettings,
  'icon-minimize': Defaults.IconMinimize,
  'icon-close': Defaults.IconClose,
  'resize-grip': Defaults.ResizeGrip,
};

export const TEXTURE_SLOTS = [
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
];

const customFiles = import.meta.glob('../assets/sprites/*.{png,jpg,jpeg,gif,webp,svg}', {
  eager: true,
  import: 'default',
});

const slotNameFromPath = (filePath) => filePath.split('/').pop().replace(/\.[^.]+$/, '');

export function buildCustomSpriteMap(files) {
  return Object.fromEntries(Object.entries(files).map(([filePath, url]) => [slotNameFromPath(filePath), url]));
}

const customSprites = buildCustomSpriteMap(customFiles);

export const customSpriteUrl = (slot) => customSprites[slot] ?? null;
