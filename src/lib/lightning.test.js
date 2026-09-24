import { expect, it } from 'vitest';
import { nextStrike } from './lightning';

const config = { minDelayMs: 1000, maxDelayMs: 5000, minLeftPercent: 10, maxLeftPercent: 50 };

it('picks delay and position within the configured ranges', () => {
  expect(nextStrike(config, () => 0)).toEqual({ delayMs: 1000, leftPercent: 10, flipped: true });
  expect(nextStrike(config, () => 0.999)).toEqual({ delayMs: 4996, leftPercent: 50, flipped: false });
});
