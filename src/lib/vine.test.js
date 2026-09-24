import { describe, expect, it } from 'vitest';
import { budPosition, clampScroll, hiddenBelow, lastStemKnot, layoutLeaves, maxScroll, stemOffsetY, wheelPixels } from './vine';

const layout = { topOffset: 10, spacing: 50, attachY: 20 };
const straight = { bend: 0, minBend: 0 };

describe('layoutLeaves', () => {
  it('stacks leaves downward alternating sides', () => {
    expect(layoutLeaves(['s', 'a', 'b'], layout, straight)).toMatchObject([
      { id: 's', index: 0, side: 'right', y: 10 },
      { id: 'a', index: 1, side: 'left', y: 60 },
      { id: 'b', index: 2, side: 'right', y: 110 },
    ]);
  });

  it('attaches each leaf where the stem bends toward it', () => {
    const [right, left] = layoutLeaves(['s', 'a'], layout);
    expect(right.x).toBeGreaterThan(0);
    expect(left.x).toBeLessThan(0);
  });

});

describe('scrolling', () => {
  it('scrolls freely in pixels up to the end of the vine', () => {
    expect(maxScroll(10, 210, layout)).toBe(300);
    expect(maxScroll(2, 210, layout)).toBe(0);
    expect(clampScroll(-3, 10, 210, layout)).toBe(0);
    expect(clampScroll(137, 10, 210, layout)).toBe(137);
    expect(clampScroll(999, 10, 210, layout)).toBe(300);
  });

  it('counts leaves hidden below the view', () => {
    expect(hiddenBelow(10, 0, 210, layout)).toBe(6);
    expect(hiddenBelow(10, 300, 210, layout)).toBe(0);
    expect(hiddenBelow(2, 0, 210, layout)).toBe(0);
  });

  it('draws the stem past the last leaf and at least a screen tall', () => {
    expect(lastStemKnot(2, 210, layout)).toBe(6);
    expect(lastStemKnot(10, 210, layout)).toBe(11);
  });

  it('converts line-based wheel deltas to pixels', () => {
    expect(wheelPixels({ deltaMode: 0, deltaY: 40 })).toBe(40);
    expect(wheelPixels({ deltaMode: 1, deltaY: 3 })).toBe(48);
  });
});

describe('empty vine', () => {
  it('drops the stem so its tip sits halfway down, with the bud on the tip', () => {
    const offset = stemOffsetY(0, 300, layout);
    expect(offset + 30).toBe(150);
    expect(budPosition(300, { ...layout, width: 100 }, { bend: 0, minBend: 0 })).toEqual({ x: 50, y: 150 });
  });

  it('sits at the top once leaves exist', () => {
    expect(stemOffsetY(4, 300, layout)).toBe(0);
  });
});
