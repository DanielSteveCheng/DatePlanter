import { useEffect, useMemo, useRef } from 'react';

export function useDebouncedCallback(callback, delayMs) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const debounced = useMemo(() => {
    let timer;
    const fn = (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => callbackRef.current(...args), delayMs);
    };
    fn.cancel = () => clearTimeout(timer);
    return fn;
  }, [delayMs]);

  useEffect(() => debounced.cancel, [debounced]);
  return debounced;
}
