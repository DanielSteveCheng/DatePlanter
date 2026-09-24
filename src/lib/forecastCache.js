const CACHE_KEY = 'date-planter:forecast';

const dayKey = (date) => date.toDateString();

function defaultStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

const matches = (entry, location, units, now) =>
  entry &&
  entry.latitude === location.latitude &&
  entry.longitude === location.longitude &&
  entry.units === units &&
  entry.day === dayKey(now);

export function readCachedForecast(location, units, { now = new Date(), storage = defaultStorage() } = {}) {
  try {
    const entry = JSON.parse(storage?.getItem(CACHE_KEY) ?? 'null');
    return matches(entry, location, units, now) ? entry.forecast : null;
  } catch {
    return null;
  }
}

export function writeCachedForecast(location, units, forecast, { now = new Date(), storage = defaultStorage() } = {}) {
  try {
    const entry = { latitude: location.latitude, longitude: location.longitude, units, day: dayKey(now), forecast };
    storage?.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // Storage can be unavailable or full; the forecast just won't be remembered.
  }
}
