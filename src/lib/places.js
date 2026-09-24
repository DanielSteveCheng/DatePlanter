export const PLACE_SEARCH = {
  endpoint: 'https://photon.komoot.io/api/',
  minQueryLength: 3,
  debounceMs: 350,
  limit: 5,
};

export function buildPlaceSearchUrl(query, near, config = PLACE_SEARCH) {
  const params = new URLSearchParams({ q: query, limit: String(config.limit), lang: 'en' });
  if (near) {
    params.set('lat', String(near.latitude));
    params.set('lon', String(near.longitude));
  }
  return `${config.endpoint}?${params}`;
}

const joinParts = (...parts) => parts.filter(Boolean).join(', ');

export function toPlace({ properties: p, geometry }) {
  const [longitude, latitude] = geometry.coordinates;
  const street = [p.housenumber, p.street].filter(Boolean).join(' ') || null;
  const locality = p.city ?? p.town ?? p.village ?? p.county;
  const name = p.name ?? street ?? locality;
  return {
    id: `${p.osm_type}${p.osm_id}`,
    name,
    label: joinParts(name, name === locality ? p.state : locality),
    address: joinParts(street !== name && street, locality, p.state, p.country),
    latitude,
    longitude,
  };
}

export function parsePlaceSearch(json) {
  const seen = new Set();
  return (json.features ?? [])
    .filter((feature) => feature.geometry?.coordinates && (feature.properties?.name || feature.properties?.street))
    .map(toPlace)
    .filter((place) => !seen.has(place.id) && seen.add(place.id));
}

export async function searchPlaces(query, near, { fetchImpl = fetch, signal } = {}) {
  const response = await fetchImpl(buildPlaceSearchUrl(query, near), { signal });
  if (!response.ok) throw new Error(`Place search failed (${response.status})`);
  return parsePlaceSearch(await response.json());
}

export const placeKey = (date) => date.place?.id ?? date.where?.trim().toLowerCase();

export const placeLabel = (date) => date.place?.label ?? date.where?.trim();
