import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBridge } from '../api/BridgeContext';
import { sortNewestFirst } from '../lib/dates';
import { readableError } from '../lib/errors';

export function useGarden() {
  const bridge = useBridge();
  const [garden, setGarden] = useState({ dates: [], notes: '', messages: [] });
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    bridge.garden
      .load()
      .then(setGarden, (e) => setError(readableError(e)))
      .finally(() => setLoaded(true));
    const offChange = bridge.garden.onChange((next) => {
      setGarden(next);
      setError(null);
      setLoaded(true);
    });
    const offError = bridge.garden.onError((message) => setError(readableError(message)));
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
          setError(readableError(e));
          throw e;
        },
      ),
    [],
  );

  const dates = useMemo(() => sortNewestFirst(garden.dates), [garden.dates]);

  return {
    dates,
    notes: garden.notes,
    messages: garden.messages ?? [],
    error,
    dismissError: () => setError(null),
    loaded,
    saveDate: (date) => run(() => bridge.garden.upsertDate(date)),
    deleteDate: (id) => run(() => bridge.garden.deleteDate(id)),
    saveNotes: (notes) => run(() => bridge.garden.saveNotes(notes)),
    saveMessage: (message) => run(() => bridge.garden.upsertMessage(message)),
  };
}
