import { useCallback, useRef, useState } from 'react';
import { removeById, upsertById } from '../lib/list';

export function useLocalRecords(createBatch) {
  const [records, setRecords] = useState([]);
  const nextNumber = useRef(1);
  const createRef = useRef(createBatch);
  createRef.current = createBatch;

  const add = useCallback((count = 1) => {
    const created = createRef.current(count, nextNumber.current);
    nextNumber.current += count;
    setRecords((current) => [...current, ...created]);
  }, []);

  return {
    records,
    add,
    save: useCallback((record) => setRecords((current) => upsertById(current, record)), []),
    remove: useCallback((id) => setRecords((current) => removeById(current, id)), []),
    clear: useCallback(() => setRecords([]), []),
  };
}
