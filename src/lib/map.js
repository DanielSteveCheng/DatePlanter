export const MAP_TILES = {
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
};

export const MAP_VIEW = {
  singlePinZoom: 14,
  fitPadding: 32,
  fallbackCenter: [39.5, -98.35],
  fallbackZoom: 3,
};

export function groupDatesByPlace(dates) {
  const pins = new Map();
  for (const date of dates) {
    const { place } = date;
    if (!place || typeof place.latitude !== 'number' || typeof place.longitude !== 'number') continue;
    const pin = pins.get(place.id) ?? { key: place.id, label: place.label, latitude: place.latitude, longitude: place.longitude, dates: [] };
    pin.dates.push(date);
    pins.set(place.id, pin);
  }
  return [...pins.values()].sort((a, b) => b.dates.length - a.dates.length);
}
