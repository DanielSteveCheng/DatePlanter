export const CONDITIONS = ['sunny', 'partly', 'cloudy', 'rain', 'thunder', 'snow'];

export const SCENES = {
  sunny: { sky: 'clear', bodies: ['sun'], precipitation: null, lightning: false, wind: 'calm' },
  partly: { sky: 'clear', bodies: ['sun', 'cloud'], precipitation: null, lightning: false, wind: 'calm' },
  cloudy: { sky: 'overcast', bodies: ['cloud'], precipitation: null, lightning: false, wind: 'calm' },
  rain: { sky: 'overcast', bodies: ['cloud'], precipitation: 'raindrop', lightning: false, wind: 'breezy' },
  thunder: { sky: 'overcast', bodies: ['cloud-bolt', 'cloud'], precipitation: 'raindrop', lightning: true, wind: 'stormy' },
  snow: { sky: 'snow', bodies: ['cloud-snowflake', 'cloud'], precipitation: 'snowflake', lightning: false, wind: 'calm' },
};

export const WIND = {
  calm: { leafSway: 4, vineSway: 0.4, period: 4 },
  breezy: { leafSway: 8, vineSway: 0.9, period: 3 },
  stormy: { leafSway: 14, vineSway: 1.6, period: 2.2 },
};

export const windFor = (scene) => WIND[scene.wind] ?? WIND.calm;

export const windStyle = ({ leafSway, vineSway, period }) => ({
  '--leaf-sway': `${leafSway}deg`,
  '--vine-sway': `${vineSway}deg`,
  '--sway-period': `${period}s`,
});

const CODE_RANGES = [
  { max: 1, condition: 'sunny' },
  { max: 2, condition: 'partly' },
  { max: 48, condition: 'cloudy' },
  { max: 67, condition: 'rain' },
  { max: 77, condition: 'snow' },
  { max: 82, condition: 'rain' },
  { max: 86, condition: 'snow' },
  { max: 99, condition: 'thunder' },
];

export function conditionFromCode(code) {
  if (typeof code !== 'number' || code < 0) return 'sunny';
  return CODE_RANGES.find((range) => code <= range.max)?.condition ?? 'cloudy';
}

export const sceneFor = (condition) => SCENES[condition] ?? SCENES.sunny;

export function buildForecastUrl({ latitude, longitude }, units = 'fahrenheit') {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'weather_code',
    daily: 'temperature_2m_max,temperature_2m_min',
    temperature_unit: units,
    timezone: 'auto',
    forecast_days: '1',
  });
  return `https://api.open-meteo.com/v1/forecast?${params}`;
}

export function parseForecast(json, now = new Date()) {
  return {
    dayName: now.toLocaleDateString(undefined, { weekday: 'long' }),
    high: Math.round(json.daily.temperature_2m_max[0]),
    low: Math.round(json.daily.temperature_2m_min[0]),
    condition: conditionFromCode(json.current.weather_code),
  };
}

export async function fetchForecast(location, units, fetchImpl = fetch) {
  const response = await fetchImpl(buildForecastUrl(location, units));
  if (!response.ok) throw new Error(`Weather request failed (${response.status})`);
  return parseForecast(await response.json());
}

export const buildGeocodeUrl = (query) =>
  `https://geocoding-api.open-meteo.com/v1/search?${new URLSearchParams({ name: query, count: '5' })}`;

export function parseGeocode(json) {
  return (json.results ?? []).map((place) => ({
    name: [place.name, place.admin1, place.country_code].filter(Boolean).join(', '),
    latitude: place.latitude,
    longitude: place.longitude,
  }));
}

export async function searchPlaces(query, fetchImpl = fetch) {
  const response = await fetchImpl(buildGeocodeUrl(query));
  if (!response.ok) throw new Error(`Location search failed (${response.status})`);
  return parseGeocode(await response.json());
}

export const activeCondition = ({ devMode, weatherPreview }, forecast) =>
  devMode && weatherPreview && weatherPreview !== 'live' ? weatherPreview : forecast?.condition;
