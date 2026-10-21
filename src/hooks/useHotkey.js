import { useEffect, useRef } from 'react';

export function matchesHotkey(event, { key, ctrl = false, shift = false }) {
  const ctrlDown = Boolean(event.ctrlKey || event.metaKey);
  return event.key.toLowerCase() === key && ctrlDown === ctrl && Boolean(event.shiftKey) === shift;
}

export function useHotkey(combo, handler) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;
  const { key, ctrl, shift } = combo;

  useEffect(() => {
    const onKeyDown = (event) => {
      if (!matchesHotkey(event, { key, ctrl, shift })) return;
      event.preventDefault();
      handlerRef.current();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [key, ctrl, shift]);
}
