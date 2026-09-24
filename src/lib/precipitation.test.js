import { describe, expect, it } from 'vitest';
import { PRECIPITATION, layoutParticles } from './precipitation';

function sequence(...values) {
  let i = 0;
  return () => values[i++ % values.length];
}

describe('layoutParticles', () => {
  const config = PRECIPITATION.raindrop;

  it('creates one particle per count', () => {
    expect(layoutParticles(config)).toHaveLength(config.count);
  });

  it('starts every particle mid-fall so none wait at the spawn line', () => {
    layoutParticles(config).forEach(({ delay, duration }) => {
      expect(delay).toBeLessThanOrEqual(0);
      expect(delay).toBeGreaterThan(-duration);
    });
  });

  it('maps random draws onto the configured ranges', () => {
    const [low] = layoutParticles({ ...config, count: 1 }, () => 0);
    expect(low).toEqual({
      leftPercent: 0,
      duration: config.minDuration,
      delay: -0,
      size: config.size * (1 - config.sizeJitter),
      driftX: config.driftX * (1 - config.driftJitter),
    });
  });

  it('varies each particle independently', () => {
    const particles = layoutParticles({ ...config, count: 2 }, sequence(0.1, 0.9, 0.5, 0.3, 0.7, 0.8, 0.2, 0.6, 0.4, 0.05));
    expect(particles[0].leftPercent).not.toBe(particles[1].leftPercent);
    expect(particles[0].duration).not.toBe(particles[1].duration);
  });
});
