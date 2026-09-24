import { describe, expect, it, vi } from 'vitest';
import { buildPlaceSearchUrl, parsePlaceSearch, placeKey, placeLabel, searchPlaces } from './places';

const feature = (properties, coordinates = [-79.99, 40.44]) => ({ properties, geometry: { coordinates } });

const umi = feature({
  osm_type: 'N',
  osm_id: 42,
  name: 'Umi',
  housenumber: '5849',
  street: 'Ellsworth Avenue',
  city: 'Pittsburgh',
  state: 'Pennsylvania',
  country: 'United States',
});

describe('buildPlaceSearchUrl', () => {
  it('biases results toward a nearby point when given one', () => {
    const url = new URL(buildPlaceSearchUrl('sushi', { latitude: 40.4, longitude: -80 }));
    expect(url.searchParams.get('q')).toBe('sushi');
    expect(url.searchParams.get('lat')).toBe('40.4');
    expect(new URL(buildPlaceSearchUrl('sushi')).searchParams.has('lat')).toBe(false);
  });
});

describe('parsePlaceSearch', () => {
  it('turns features into places with a short label and full address', () => {
    expect(parsePlaceSearch({ features: [umi] })).toEqual([
      {
        id: 'N42',
        name: 'Umi',
        label: 'Umi, Pittsburgh',
        address: '5849 Ellsworth Avenue, Pittsburgh, Pennsylvania, United States',
        latitude: 40.44,
        longitude: -79.99,
      },
    ]);
  });

  it('labels cities by their state and drops duplicates and unnamed results', () => {
    const city = feature({ osm_type: 'R', osm_id: 1, name: 'Pittsburgh', city: 'Pittsburgh', state: 'Pennsylvania' });
    const places = parsePlaceSearch({ features: [city, city, feature({ osm_type: 'N', osm_id: 2 })] });
    expect(places.map((p) => p.label)).toEqual(['Pittsburgh, Pennsylvania']);
  });

  it('handles an empty response', () => {
    expect(parsePlaceSearch({})).toEqual([]);
  });
});

it('reports failed searches', async () => {
  const fetchImpl = vi.fn().mockResolvedValue({ ok: false, status: 503 });
  await expect(searchPlaces('x', null, { fetchImpl })).rejects.toThrow('503');
});

describe('place identity', () => {
  it('uses the pinned place when there is one, else the typed text', () => {
    expect(placeKey({ where: 'Umi', place: { id: 'N42' } })).toBe('N42');
    expect(placeKey({ where: ' The Park ', place: null })).toBe('the park');
    expect(placeLabel({ where: 'umi', place: { label: 'Umi, Pittsburgh' } })).toBe('Umi, Pittsburgh');
    expect(placeLabel({ where: ' The Park ' })).toBe('The Park');
  });
});
