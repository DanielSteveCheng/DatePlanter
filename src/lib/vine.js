import { STEM, knotX, knotY } from './stem';

export const VINE_LAYOUT = {
  right: 5,
  width: 144,
  topOffset: 16,
  spacing: 64,
  attachY: 20,
};

export const sideFor = (index) => (index % 2 === 0 ? 'right' : 'left');

export const contentHeight = (leafCount, layout = VINE_LAYOUT) => layout.topOffset + leafCount * layout.spacing;

export const maxScroll = (leafCount, height, layout = VINE_LAYOUT) =>
  Math.max(0, contentHeight(leafCount, layout) - height);

export const clampScroll = (scroll, leafCount, height, layout = VINE_LAYOUT) =>
  Math.min(Math.max(0, scroll), maxScroll(leafCount, height, layout));

export function hiddenBelow(leafCount, scroll, height, layout = VINE_LAYOUT) {
  const lastVisible = Math.floor((scroll + height - layout.topOffset - layout.attachY) / layout.spacing);
  return Math.max(0, leafCount - 1 - lastVisible);
}

export const lastStemKnot = (leafCount, height, layout = VINE_LAYOUT) =>
  Math.max(leafCount, Math.ceil(height / layout.spacing)) + 1;

export const wheelPixels = (event, lineHeight = 16) => (event.deltaMode === 1 ? event.deltaY * lineHeight : event.deltaY);

export function layoutLeaves(ids, layout = VINE_LAYOUT, stem = STEM) {
  return ids.map((id, index) => ({
    id,
    index,
    side: sideFor(index),
    x: knotX(index, stem),
    y: layout.topOffset + index * layout.spacing,
  }));
}

export const stemOffsetY = (leafCount, height, layout = VINE_LAYOUT) =>
  leafCount === 0 ? Math.round(height / 2 - knotY(0, layout)) : 0;

export function budPosition(height, layout = VINE_LAYOUT, stem = STEM) {
  return { x: layout.width / 2 + knotX(0, stem), y: Math.round(height / 2) };
}
