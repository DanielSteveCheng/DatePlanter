import { useEffect, useState } from 'react';
import { PLACE_SEARCH, searchPlaces } from '../lib/places';

const IDLE = { status: 'idle', results: [] };

export function usePlaceSearch(query, near) {
  const [state, setState] = useState(IDLE);
  const latitude = near?.latitude;
  const longitude = near?.longitude;

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < PLACE_SEARCH.minQueryLength) {
      setState(IDLE);
      return undefined;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setState((current) => ({ ...current, status: 'searching' }));
      const bias = latitude == null ? null : { latitude, longitude };
      searchPlaces(trimmed, bias, { signal: controller.signal }).then(
        (results) => setState({ status: results.length ? 'done' : 'empty', results }),
        (error) => error.name !== 'AbortError' && setState({ status: 'error', results: [] }),
      );
    }, PLACE_SEARCH.debounceMs);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, latitude, longitude]);

  return state;
}
