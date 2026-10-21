import { describe, expect, it } from 'vitest';
import { scrollTopForDrag, thumbMetrics } from './scroll';

describe('thumbMetrics', () => {
  it('hides the thumb when content fits', () => {
    expect(thumbMetrics({ scrollTop: 0, scrollHeight: 100, clientHeight: 100 }, 100)).toBeNull();
  });

  it('sizes the thumb by the visible fraction and positions it by scroll progress', () => {
    const viewport = { scrollTop: 150, scrollHeight: 400, clientHeight: 100 };
    expect(thumbMetrics(viewport, 100)).toEqual({ size: 25, offset: 37.5, maxOffset: 75 });
  });

  it('never shrinks the thumb below the minimum', () => {
    expect(thumbMetrics({ scrollTop: 0, scrollHeight: 10000, clientHeight: 100 }, 100, 16).size).toBe(16);
  });
});

it('converts thumb drag distance into scroll distance', () => {
  expect(scrollTopForDrag(0, 15, { scrollHeight: 400, clientHeight: 100 }, 75)).toBe(60);
});
