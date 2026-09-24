import { useCallback, useEffect, useRef, useState } from 'react';
import { MOMENTUM, clampVelocity, glideVelocity, stepMomentum } from '../lib/momentum';

export function useMomentumScroll(max, config = MOMENTUM) {
  const [scroll, setScroll] = useState(0);
  const motion = useRef({ scroll: 0, velocity: 0 });
  const frame = useRef(null);
  const maxRef = useRef(max);
  maxRef.current = max;

  const run = useCallback(() => {
    if (frame.current) return;
    let last = null;
    const loop = (now) => {
      const elapsed = last === null ? config.frameMs : now - last;
      motion.current = stepMomentum(motion.current, elapsed, maxRef.current, config);
      last = now;
      setScroll(motion.current.scroll);
      if (motion.current.velocity === 0) {
        frame.current = null;
        return;
      }
      frame.current = requestAnimationFrame(loop);
    };
    frame.current = requestAnimationFrame(loop);
  }, [config]);

  const push = useCallback(
    (delta) => {
      const velocity = clampVelocity(motion.current.velocity + delta * config.impulse, config);
      motion.current = { ...motion.current, velocity };
      run();
    },
    [config, run],
  );

  const glideBy = useCallback(
    (distance) => {
      motion.current = { ...motion.current, velocity: glideVelocity(distance, config) };
      run();
    },
    [config, run],
  );

  useEffect(() => {
    const clamped = Math.min(Math.max(motion.current.scroll, 0), max);
    if (clamped === motion.current.scroll) return;
    motion.current = { scroll: clamped, velocity: 0 };
    setScroll(clamped);
  }, [max]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return { scroll, push, glideBy };
}
