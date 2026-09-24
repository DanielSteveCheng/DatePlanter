import { describe, expect, it } from 'vitest';
import { clampScroll, layoutLeaves, visibleLeafCount } from './vine';

const layout = { topOffset: 10, spacing: 50 };

describe('layoutLeaves', () => {
  it('stacks leaves downward alternating sides', () => {
    expect(layoutLeaves(['s', 'a', 'b'], 0, layout)).toEqual([
      { id: 's', index: 0, side: 'right', y: 10 },
      { id: 'a', index: 1, side: 'left', y: 60 },
      { id: 'b', index: 2, side: 'right', y: 110 },
    ]);
  });

  it('shifts everything up when scrolled', () => {
    expect(layoutLeaves(['s', 'a'], 1, layout)[1].y).toBe(10);
  });
});

describe('scrolling', () => {
  it('clamps between 0 and the number of hidden leaves', () => {
    expect(clampScroll(-3, 10, 4)).toBe(0);
    expect(clampScroll(99, 10, 4)).toBe(6);
    expect(clampScroll(5, 3, 4)).toBe(0);
  });

  it('computes how many leaves fit', () => {
    expect(visibleLeafCount(210, layout)).toBe(4);
    expect(visibleLeafCount(0, layout)).toBe(1);
  });
});
