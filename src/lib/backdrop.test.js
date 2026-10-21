import { describe, expect, it } from 'vitest';
import { BACKDROP_CLOUDS, layoutBackdropClouds } from './backdrop';

const layers = [
  { count: 2, size: 50, top: [0, 20], seconds: 100, opacity: 0.4 },
  { count: 1, size: 100, top: [40, 60], seconds: 40, opacity: 0.8 },
];
const noJitter = { size: 0, speed: 0, spacing: 0 };

describe('layoutBackdropClouds', () => {
  it('makes one cloud per count in every layer, farthest first', () => {
    const clouds = layoutBackdropClouds(BACKDROP_CLOUDS);
    expect(clouds).toHaveLength(BACKDROP_CLOUDS.reduce((sum, layer) => sum + layer.count, 0));
    expect(clouds.map((c) => c.depth)).toEqual([...clouds.map((c) => c.depth)].sort());
  });

  it('keeps each cloud inside its layer and spreads them evenly across the crossing', () => {
    const clouds = layoutBackdropClouds(layers, () => 0.5, noJitter);
    expect(clouds.map((c) => c.topPercent)).toEqual([10, 10, 50]);
    expect(clouds.map((c) => c.width)).toEqual([50, 50, 100]);
    expect(clouds.map((c) => c.delay)).toEqual([-0, -50, -0]);
  });

  it('starts clouds part-way across so the sky is never empty', () => {
    layoutBackdropClouds(BACKDROP_CLOUDS).forEach((cloud) => {
      expect(cloud.delay).toBeLessThanOrEqual(0);
      expect(cloud.delay).toBeGreaterThan(-cloud.seconds);
    });
  });

  it('makes nearer layers bigger, faster and more solid than farther ones', () => {
    for (let i = 1; i < BACKDROP_CLOUDS.length; i++) {
      expect(BACKDROP_CLOUDS[i].size).toBeGreaterThan(BACKDROP_CLOUDS[i - 1].size);
      expect(BACKDROP_CLOUDS[i].seconds).toBeLessThan(BACKDROP_CLOUDS[i - 1].seconds);
      expect(BACKDROP_CLOUDS[i].opacity).toBeGreaterThan(BACKDROP_CLOUDS[i - 1].opacity);
    }
  });
});
