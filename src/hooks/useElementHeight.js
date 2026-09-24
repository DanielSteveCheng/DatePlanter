import { useCallback, useState } from 'react';

export function useElementHeight() {
  const [height, setHeight] = useState(0);
  const ref = useCallback((element) => {
    if (!element) return undefined;
    const observer = new ResizeObserver(([entry]) => setHeight(entry.contentRect.height));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return [ref, height];
}
