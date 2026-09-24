import { describe, expect, it } from 'vitest';
import { MOMENTUM, glideVelocity, stepMomentum } from './momentum';

function glide(state, max, config = MOMENTUM) {
  let current = state;
  let frames = 0;
  while (current.velocity !== 0 && frames < 1000) {
    current = stepMomentum(current, config.frameMs, max, config);
    frames++;
  }
  return { ...current, frames };
}

describe('stepMomentum', () => {
  it('keeps moving after the push and slows down with friction', () => {
    const first = stepMomentum({ scroll: 0, velocity: 1 }, 16, 1000);
    expect(first.scroll).toBe(16);
    expect(first.velocity).toBeCloseTo(0.92);
    expect(glide({ scroll: 0, velocity: 1 }, 1000).frames).toBeGreaterThan(10);
  });

  it('stops dead at either end', () => {
    expect(stepMomentum({ scroll: 5, velocity: -1 }, 16, 1000)).toEqual({ scroll: 0, velocity: 0 });
    expect(stepMomentum({ scroll: 995, velocity: 1 }, 16, 1000)).toEqual({ scroll: 1000, velocity: 0 });
  });

  it('ignores negative frame gaps instead of treating them as reverse motion', () => {
    expect(stepMomentum({ scroll: 0, velocity: 1 }, -5, 1000)).toEqual({ scroll: 0, velocity: 1 });
  });

  it('caps huge frame gaps so a stalled frame cannot fling the vine', () => {
    expect(stepMomentum({ scroll: 0, velocity: 1 }, 5000, 10000).scroll).toBe(MOMENTUM.maxStepMs);
  });
});

it('glides roughly the requested distance', () => {
  const { scroll } = glide({ scroll: 0, velocity: glideVelocity(64) }, 1000);
  expect(scroll).toBeGreaterThan(58);
  expect(scroll).toBeLessThanOrEqual(64);
});
