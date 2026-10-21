import { describe, expect, it } from 'vitest';
import { isStartupReady } from './startup';

const loaded = { settingsLoaded: true, gardenLoaded: true, weatherSettled: true };
const config = { minShowMs: 500, maxWeatherWaitMs: 2000 };

describe('isStartupReady', () => {
  it('waits for settings and the garden no matter how long it takes', () => {
    expect(isStartupReady({ ...loaded, settingsLoaded: false, elapsedMs: 9000 }, config)).toBe(false);
    expect(isStartupReady({ ...loaded, gardenLoaded: false, elapsedMs: 9000 }, config)).toBe(false);
  });

  it('shows the loading pot for a minimum time so it never just flickers', () => {
    expect(isStartupReady({ ...loaded, elapsedMs: 100 }, config)).toBe(false);
    expect(isStartupReady({ ...loaded, elapsedMs: 500 }, config)).toBe(true);
  });

  it('waits for the weather, but only up to a limit', () => {
    expect(isStartupReady({ ...loaded, weatherSettled: false, elapsedMs: 1000 }, config)).toBe(false);
    expect(isStartupReady({ ...loaded, weatherSettled: false, elapsedMs: 2000 }, config)).toBe(true);
  });
});
