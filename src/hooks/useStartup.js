import { useEffect, useRef, useState } from 'react';
import { STARTUP, isStartupReady } from '../lib/startup';

export function useStartup({ settingsLoaded, gardenLoaded, weatherSettled }, config = STARTUP) {
  const startedAt = useRef(performance.now());
  const [ready, setReady] = useState(false);
  const [, setTick] = useState(0);

  const elapsedMs = performance.now() - startedAt.current;
  const readyNow = ready || isStartupReady({ settingsLoaded, gardenLoaded, weatherSettled, elapsedMs }, config);

  useEffect(() => {
    if (readyNow) {
      setReady(true);
      return undefined;
    }
    const nextCheck = elapsedMs < config.minShowMs ? config.minShowMs - elapsedMs : config.maxWeatherWaitMs - elapsedMs;
    if (nextCheck <= 0) return undefined;
    const timer = setTimeout(() => setTick((tick) => tick + 1), nextCheck);
    return () => clearTimeout(timer);
  });

  return readyNow;
}
