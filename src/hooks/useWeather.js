import { useCallback, useEffect, useState } from 'react';
import { fetchForecast } from '../lib/weather';
import { readCachedForecast, writeCachedForecast } from '../lib/forecastCache';
import { readableError } from '../lib/errors';

const REFRESH_MS = 30 * 60 * 1000;

export const isWeatherSettled = (status) => status !== 'idle' && status !== 'loading';

export function useWeather(location, units) {
  const [state, setState] = useState({ status: 'idle', forecast: null, error: null });
  const [attempt, setAttempt] = useState(0);
  const latitude = location?.latitude;
  const longitude = location?.longitude;

  useEffect(() => {
    if (latitude == null || longitude == null) {
      setState({ status: 'no-location', forecast: null, error: null });
      return undefined;
    }
    let cancelled = false;
    const location = { latitude, longitude };
    const cached = readCachedForecast(location, units);
    setState((prev) => {
      if (cached) return { status: 'ready', forecast: cached, error: null };
      return prev.forecast ? prev : { status: 'loading', forecast: null, error: null };
    });
    const refresh = () =>
      fetchForecast(location, units).then(
        (forecast) => {
          if (cancelled) return;
          writeCachedForecast(location, units, forecast);
          setState({ status: 'ready', forecast, error: null });
        },
        (error) =>
          !cancelled &&
          setState((prev) => ({ ...prev, status: prev.forecast ? 'ready' : 'error', error: readableError(error) })),
      );
    refresh();
    const timer = setInterval(refresh, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [latitude, longitude, units, attempt]);

  const retry = useCallback(() => setAttempt((current) => current + 1), []);

  return { ...state, retry };
}
