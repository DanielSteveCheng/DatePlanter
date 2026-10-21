import { useRef } from 'react';

const DRAG_THRESHOLD_PX = 4;

export function usePotGesture(win, onOpen) {
  const gesture = useRef(null);

  function onPointerDown(event) {
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current = { x: event.screenX, y: event.screenY, dragging: false };
  }

  function onPointerMove(event) {
    const current = gesture.current;
    if (!current || current.dragging) return;
    if (Math.hypot(event.screenX - current.x, event.screenY - current.y) < DRAG_THRESHOLD_PX) return;
    current.dragging = true;
    win.beginDrag();
  }

  function onPointerUp() {
    const current = gesture.current;
    gesture.current = null;
    if (current?.dragging) win.endDrag();
    else if (current) onOpen();
  }

  return {
    isActive: () => gesture.current !== null,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onLostPointerCapture: onPointerUp },
  };
}
