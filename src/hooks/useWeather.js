import { useEffect, useState } from 'react';
import { fetchForecast } from '../lib/weather';
import { readCachedForecast, writeCachedForecast } from '../lib/forecastCache';

const REFRESH_MS = 30 * 60 * 1000;

export const isWeatherSettled = (status) => status !== 'idle' && status !== 'loading';

export function useWeather(location, units) {
  const [state, setState] = useState({ status: 'idle', forecast: null });
  const latitude = location?.latitude;
  const longitude = location?.longitude;

  useEffect(() => {
    if (latitude == null || longitude == null) {
      setState({ status: 'no-location', forecast: null });
      return undefined;
    }
    let cancelled = false;
    const location = { latitude, longitude };
    const cached = readCachedForecast(location, units);
    setState((prev) => {
      if (cached) return { status: 'ready', forecast: cached };
      return prev.forecast ? prev : { status: 'loading', forecast: null };
    });
    const refresh = () =>
      fetchForecast(location, units).then(
        (forecast) => {
          if (cancelled) return;
          writeCachedForecast(location, units, forecast);
          setState({ status: 'ready', forecast });
        },
        () => !cancelled && setState((prev) => ({ ...prev, status: prev.forecast ? 'ready' : 'error' })),
      );
    refresh();
    const timer = setInterval(refresh, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [latitude, longitude, units]);

  return state;
}
