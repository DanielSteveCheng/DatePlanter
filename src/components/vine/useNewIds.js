import { useEffect, useRef } from 'react';

export function useNewIds(ids) {
  const seen = useRef(null);
  const isFirstRender = seen.current === null;
  const newIds = new Set(isFirstRender ? [] : ids.filter((id) => !seen.current.has(id)));

  useEffect(() => {
    seen.current = new Set(ids);
  });

  return newIds;
}
