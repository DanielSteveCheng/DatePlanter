import { describe, expect, it, vi } from 'vitest';
import { buildForecastUrl, conditionFromCode, fetchForecast, parseGeocode, sceneFor, SCENES, CONDITIONS } from './weather';

describe('conditionFromCode', () => {
  it.each([
    [0, 'sunny'],
    [1, 'sunny'],
    [2, 'partly'],
    [3, 'cloudy'],
    [45, 'cloudy'],
    [61, 'rain'],
    [73, 'snow'],
    [81, 'rain'],
    [85, 'snow'],
    [95, 'thunder'],
  ])('maps WMO code %i to %s', (code, condition) => {
    expect(conditionFromCode(code)).toBe(condition);
  });

  it('falls back to sunny for missing codes', () => {
    expect(conditionFromCode(undefined)).toBe('sunny');
  });
});

describe('scenes', () => {
  it('defines a scene for every condition', () => {
    CONDITIONS.forEach((condition) => expect(SCENES[condition]).toBeDefined());
  });

  it('uses rain and lightning for thunder', () => {
    expect(sceneFor('thunder')).toMatchObject({ precipitation: 'raindrop', lightning: true, sky: 'overcast' });
  });

  it('falls back to the sunny scene', () => {
    expect(sceneFor(undefined)).toBe(SCENES.sunny);
  });
});

describe('forecast', () => {
  it('builds a url with location and units', () => {
    const url = new URL(buildForecastUrl({ latitude: 40.7, longitude: -74 }, 'celsius'));
    expect(url.searchParams.get('latitude')).toBe('40.7');
    expect(url.searchParams.get('temperature_unit')).toBe('celsius');
  });

  it('parses highs, lows and condition', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        current: { weather_code: 3 },
        daily: { temperature_2m_max: [74.6], temperature_2m_min: [65.9] },
      }),
    });
    const forecast = await fetchForecast({ latitude: 1, longitude: 2 }, 'fahrenheit', fetchImpl);
    expect(forecast).toMatchObject({ high: 75, low: 66, condition: 'cloudy' });
  });

  it('throws on a failed response', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    await expect(fetchForecast({ latitude: 1, longitude: 2 }, 'fahrenheit', fetchImpl)).rejects.toThrow('500');
  });
});

describe('parseGeocode', () => {
  it('joins place names and handles empty results', () => {
    expect(parseGeocode({ results: [{ name: 'Austin', admin1: 'Texas', country_code: 'US', latitude: 1, longitude: 2 }] })).toEqual([
      { name: 'Austin, Texas, US', latitude: 1, longitude: 2 },
    ]);
    expect(parseGeocode({})).toEqual([]);
  });
});
