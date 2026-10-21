import { SPRITE_SIZES } from '../sprites/sizes';

export const PRECIPITATION = {
  raindrop: {
    count: 24,
    size: SPRITE_SIZES.raindrop,
    sizeJitter: 0.3,
    minDuration: 0.6,
    maxDuration: 1.3,
    spawnY: -16,
    driftX: -12,
    driftJitter: 0.5,
  },
  snowflake: {
    count: 18,
    size: SPRITE_SIZES.snowflake,
    sizeJitter: 0.5,
    minDuration: 2.6,
    maxDuration: 5.2,
    spawnY: -16,
    driftX: 16,
    driftJitter: 1.5,
  },
};

const between = (min, max, random) => min + random() * (max - min);

export const randomLeftPercent = (random = Math.random) => random() * 100;

export function layoutParticles(config, random = Math.random) {
  const { count, size, sizeJitter, minDuration, maxDuration, driftX, driftJitter } = config;
  return Array.from({ length: count }, () => {
    const duration = between(minDuration, maxDuration, random);
    return {
      leftPercent: randomLeftPercent(random),
      duration,
      delay: -random() * duration,
      size: size * between(1 - sizeJitter, 1 + sizeJitter, random),
      driftX: driftX * between(1 - driftJitter, 1 + driftJitter, random),
    };
  });
}
