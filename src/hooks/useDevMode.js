import { useState } from 'react';
import { useHotkey } from './useHotkey';
import { useLocalRecords } from './useLocalRecords';
import { createDevDates, createDevMessage } from '../lib/devFixtures';

const DEV_MODE_HOTKEY = { key: 'd', ctrl: true, shift: true };
const NONE = [];

export function useDevMode(settings, updateSettings) {
  const [showSlots, setShowSlots] = useState(false);
  const dates = useLocalRecords((count, startNumber) => createDevDates(count, { startNumber, center: settings?.location }));
  const messages = useLocalRecords((count, startNumber) =>
    Array.from({ length: count }, (_, i) => createDevMessage(startNumber + i)),
  );
  const enabled = Boolean(settings?.devMode);

  useHotkey(DEV_MODE_HOTKEY, () => settings && updateSettings({ devMode: !enabled }));

  return {
    enabled,
    showSlots: enabled && showSlots,
    toggleSlots: () => setShowSlots((current) => !current),
    preview: (weatherPreview) => updateSettings({ weatherPreview }),
    dates: enabled ? dates.records : NONE,
    addDates: dates.add,
    saveDate: dates.save,
    deleteDate: dates.remove,
    clearDates: dates.clear,
    messages: enabled ? messages.records : NONE,
    addMessage: () => messages.add(1),
    saveMessage: messages.save,
  };
}
