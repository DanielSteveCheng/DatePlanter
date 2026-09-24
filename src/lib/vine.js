export const VINE_LAYOUT = {
  topOffset: 16,
  spacing: 64,
};

export const sideFor = (index) => (index % 2 === 0 ? 'right' : 'left');

export function maxScroll(leafCount, visibleCount) {
  return Math.max(0, leafCount - visibleCount);
}

export const clampScroll = (scroll, leafCount, visibleCount) =>
  Math.min(Math.max(0, scroll), maxScroll(leafCount, visibleCount));

export function visibleLeafCount(height, layout = VINE_LAYOUT) {
  return Math.max(1, Math.floor((height - layout.topOffset) / layout.spacing));
}

export function layoutLeaves(ids, scroll = 0, layout = VINE_LAYOUT) {
  return ids.map((id, index) => ({
    id,
    index,
    side: sideFor(index),
    y: layout.topOffset + (index - scroll) * layout.spacing,
  }));
}
