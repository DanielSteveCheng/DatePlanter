import { useEffect, useState } from 'react';
import { LIGHTNING, nextStrike } from '../lib/lightning';

export function useLightningStrikes(config = LIGHTNING) {
  const [strike, setStrike] = useState(null);

  useEffect(() => {
    let timer;
    let id = 0;
    const schedule = (delayMs) => {
      timer = setTimeout(() => {
        const next = nextStrike(config);
        setStrike({ id: ++id, ...next });
        schedule(next.delayMs);
      }, delayMs);
    };
    schedule(config.firstDelayMs);
    return () => clearTimeout(timer);
  }, [config]);

  return strike;
}
