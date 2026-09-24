import { useState } from 'react';
import { useHotkey } from './useHotkey';
import { useDevDates } from './useDevDates';

export const DEV_MODE_HOTKEY = { key: 'd', ctrl: true, shift: true };
const NO_DATES = [];

export function useDevMode(settings, updateSettings) {
  const [showSlots, setShowSlots] = useState(false);
  const devDates = useDevDates(settings?.location);
  const enabled = Boolean(settings?.devMode);

  useHotkey(DEV_MODE_HOTKEY, () => settings && updateSettings({ devMode: !enabled }));

  return {
    enabled,
    showSlots: enabled && showSlots,
    toggleSlots: () => setShowSlots((current) => !current),
    preview: (weatherPreview) => updateSettings({ weatherPreview }),
    dates: enabled ? devDates.dates : NO_DATES,
    addDates: devDates.add,
    saveDate: devDates.save,
    deleteDate: devDates.remove,
    clearDates: devDates.clear,
  };
}
