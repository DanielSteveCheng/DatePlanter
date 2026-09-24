import { useEffect, useState } from 'react';
import { fetchForecast } from '../lib/weather';

const REFRESH_MS = 30 * 60 * 1000;

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
    const refresh = () =>
      fetchForecast({ latitude, longitude }, units).then(
        (forecast) => !cancelled && setState({ status: 'ready', forecast }),
        () => !cancelled && setState((prev) => ({ ...prev, status: 'error' })),
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
