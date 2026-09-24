export const MOMENTUM = {
  impulse: 0.006,
  friction: 0.92,
  maxVelocity: 4,
  minVelocity: 0.02,
  frameMs: 16,
  maxStepMs: 64,
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const clampVelocity = (velocity, config = MOMENTUM) => clamp(velocity, -config.maxVelocity, config.maxVelocity);

export const glideVelocity = (distance, config = MOMENTUM) =>
  clampVelocity((distance * (1 - config.friction)) / config.frameMs, config);

export function stepMomentum({ scroll, velocity }, elapsedMs, max, config = MOMENTUM) {
  const dt = clamp(elapsedMs, 0, config.maxStepMs);
  const moved = scroll + velocity * dt;
  const next = clamp(moved, 0, max);
  const hitEdge = next !== moved;
  const slowed = velocity * config.friction ** (dt / config.frameMs);
  return { scroll: next, velocity: hitEdge || Math.abs(slowed) < config.minVelocity ? 0 : slowed };
}
