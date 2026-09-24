import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBridge } from '../api/BridgeContext';
import { sortNewestFirst } from '../lib/dates';

export function useGarden() {
  const bridge = useBridge();
  const [garden, setGarden] = useState({ dates: [], notes: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    bridge.garden.load().then(setGarden, (e) => setError(e.message));
    const offChange = bridge.garden.onChange((next) => {
      setGarden(next);
      setError(null);
    });
    const offError = bridge.garden.onError(setError);
    return () => {
      offChange();
      offError();
    };
  }, [bridge]);

  const run = useCallback(
    (action) =>
      action().then(
        (next) => {
          setGarden(next);
          setError(null);
          return next;
        },
        (e) => {
          setError(e.message);
          throw e;
        },
      ),
    [],
  );

  const dates = useMemo(() => sortNewestFirst(garden.dates), [garden.dates]);

  return {
    dates,
    notes: garden.notes,
    error,
    saveDate: (date) => run(() => bridge.garden.upsertDate(date)),
    deleteDate: (id) => run(() => bridge.garden.deleteDate(id)),
    saveNotes: (notes) => run(() => bridge.garden.saveNotes(notes)),
  };
}
