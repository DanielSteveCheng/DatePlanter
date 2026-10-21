export const LIGHTNING = {
  firstDelayMs: 1200,
  minDelayMs: 3000,
  maxDelayMs: 9000,
  durationMs: 600,
  minLeftPercent: 15,
  maxLeftPercent: 60,
};

const between = (min, max, random) => min + random() * (max - min);

export function nextStrike(config = LIGHTNING, random = Math.random) {
  return {
    delayMs: Math.round(between(config.minDelayMs, config.maxDelayMs, random)),
    leftPercent: Math.round(between(config.minLeftPercent, config.maxLeftPercent, random)),
    flipped: random() < 0.5,
  };
}
