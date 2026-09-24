import { useCallback, useRef, useState } from 'react';
import { createDevDates } from '../lib/devDates';
import { removeById, upsertById } from '../lib/list';

export function useDevDates(center) {
  const [dates, setDates] = useState([]);
  const nextNumber = useRef(1);

  const add = useCallback((count) => {
    const created = createDevDates(count, { startNumber: nextNumber.current, center });
    nextNumber.current += count;
    setDates((current) => [...current, ...created]);
  }, [center]);

  return {
    dates,
    add,
    save: (date) => setDates((current) => upsertById(current, date)),
    remove: (id) => setDates((current) => removeById(current, id)),
    clear: () => setDates([]),
  };
}
