import { describe, expect, it } from 'vitest';
import { STEM, isTwist, knotX, knotY, noise, stemPoints, toSvgPath, twistPoints } from './stem';

const layout = { topOffset: 10, spacing: 60, attachY: 20 };

describe('noise', () => {
  it('is deterministic and stays in [0, 1)', () => {
    for (let i = -5; i < 50; i++) {
      const value = noise(i, 1);
      expect(value).toBe(noise(i, 1));
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
    expect(noise(3, 1, 1)).not.toBe(noise(3, 1, 2));
  });
});

describe('knots', () => {
  it('bend toward alternating sides within the configured range', () => {
    for (let k = -1; k < 20; k++) {
      const x = knotX(k);
      expect(Math.sign(x)).toBe(k % 2 === 0 ? 1 : -1);
      expect(Math.abs(x)).toBeGreaterThanOrEqual(STEM.bend * STEM.minBend);
      expect(Math.abs(x)).toBeLessThanOrEqual(STEM.bend);
    }
  });

  it('sit at each leaf attachment height', () => {
    expect(knotY(0, layout)).toBe(30);
    expect(knotY(2, layout)).toBe(150);
  });

  it('never twists twice in a row', () => {
    for (let k = 0; k < 200; k++) expect(isTwist(k) && isTwist(k + 1)).toBe(false);
  });
});

describe('stemPoints', () => {
  const noTwists = { ...STEM, twistChance: 0 };
  const allTwists = { ...STEM, twistChance: 1 };

  it('passes through every knot so leaves stay attached', () => {
    const points = stemPoints(0, 3, layout, noTwists);
    for (let k = 0; k <= 3; k++) {
      expect(points).toContainEqual(expect.objectContaining({ x: knotX(k), y: knotY(k, layout) }));
    }
  });

  it('adds a closed loop for a twist', () => {
    expect(stemPoints(0, 1, layout, allTwists).length).toBe(stemPoints(0, 1, layout, noTwists).length + STEM.twistSteps + 1);
    const loop = twistPoints({ x: 0, y: 0, slope: 0.3 }, 1);
    expect(loop.at(-1).x).toBeCloseTo(0);
    expect(loop.at(-1).y).toBeCloseTo(0);
  });

  it('serializes to an svg path', () => {
    expect(toSvgPath([{ x: 1.234, y: 2 }, { x: 3, y: 4.56 }])).toBe('M1.2 2 L3 4.6');
  });
});
