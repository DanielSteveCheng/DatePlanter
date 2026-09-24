import { useCallback, useEffect, useState } from 'react';
import { useBridge } from '../api/BridgeContext';

const homePosition = () => ({ x: window.innerWidth / 2, y: window.innerHeight });

export const originAt = ({ x, y }) => `${x}px ${y}px`;

export function useMiniMode() {
  const { window: win } = useBridge();
  const [phase, setPhase] = useState('full');
  const [pot, setPot] = useState(homePosition);

  useEffect(() => win.onPotMoved(setPot), [win]);

  const collapse = useCallback(() => {
    setPot(homePosition());
    setPhase('collapsing');
  }, []);

  const expand = useCallback(() => {
    win.expand();
    setPhase('expanding');
  }, [win]);

  const finishAnimation = useCallback(() => {
    if (phase === 'expanding') setPhase('full');
    if (phase === 'collapsing') {
      setPhase('mini');
      win.collapse();
    }
  }, [phase, win]);

  return { phase, pot, collapse, expand, finishAnimation };
}
