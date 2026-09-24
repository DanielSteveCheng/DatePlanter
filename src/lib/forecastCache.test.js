import { describe, expect, it } from 'vitest';
import { readCachedForecast, writeCachedForecast } from './forecastCache';

function memoryStorage() {
  const items = new Map();
  return { getItem: (k) => items.get(k) ?? null, setItem: (k, v) => items.set(k, v) };
}

const pittsburgh = { latitude: 40.44, longitude: -79.99 };
const forecast = { dayName: 'Thursday', high: 68, low: 50, condition: 'sunny' };
const morning = new Date('2026-09-24T08:00:00');

describe('forecast cache', () => {
  it('returns the remembered forecast for the same place, units and day', () => {
    const storage = memoryStorage();
    writeCachedForecast(pittsburgh, 'fahrenheit', forecast, { now: morning, storage });
    expect(readCachedForecast(pittsburgh, 'fahrenheit', { now: new Date('2026-09-24T21:00:00'), storage })).toEqual(forecast);
  });

  it('ignores it for another day, place or unit', () => {
    const storage = memoryStorage();
    writeCachedForecast(pittsburgh, 'fahrenheit', forecast, { now: morning, storage });
    expect(readCachedForecast(pittsburgh, 'fahrenheit', { now: new Date('2026-09-25T08:00:00'), storage })).toBeNull();
    expect(readCachedForecast({ latitude: 1, longitude: 2 }, 'fahrenheit', { now: morning, storage })).toBeNull();
    expect(readCachedForecast(pittsburgh, 'celsius', { now: morning, storage })).toBeNull();
  });

  it('survives missing or broken storage', () => {
    expect(readCachedForecast(pittsburgh, 'fahrenheit', { storage: null })).toBeNull();
    const broken = { getItem: () => '{not json', setItem: () => { throw new Error('full'); } };
    expect(readCachedForecast(pittsburgh, 'fahrenheit', { storage: broken })).toBeNull();
    expect(() => writeCachedForecast(pittsburgh, 'fahrenheit', forecast, { storage: broken })).not.toThrow();
  });
});
