import { useCallback, useEffect, useState } from 'react';
import { useBridge } from '../api/BridgeContext';

export function useSettings() {
  const bridge = useBridge();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    bridge.settings.get().then(setSettings);
  }, [bridge]);

  const updateSettings = useCallback((patch) => bridge.settings.update(patch).then(setSettings), [bridge]);

  return { settings, updateSettings };
}
