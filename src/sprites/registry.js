import * as Defaults from './defaults';

export const IMAGE_SLOTS = {
  sun: Defaults.Sun,
  cloud: Defaults.Cloud,
  raindrop: Defaults.Raindrop,
  snowflake: Defaults.Snowflake,
  lightning: Defaults.Lightning,
  leaf: Defaults.Leaf,
  'leaf-sprout': Defaults.LeafSprout,
  'leaf-selected': Defaults.LeafSelected,
};

export const TEXTURE_SLOTS = [
  'frame',
  'titlebar',
  'sky-clear',
  'sky-overcast',
  'stem',
  'soil',
  'soil-panel',
  'date-card',
  'add-date-button',
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
