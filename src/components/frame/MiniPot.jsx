import { useRef } from 'react';
import { useBridge } from '../../api/BridgeContext';
import { Sprite } from '../../sprites/Sprite';
import { cn } from '../../lib/cn';

const DRAG_THRESHOLD_PX = 4;

export function MiniPot({ position, leaving, onOpen }) {
  const { window: win } = useBridge();
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

  return (
    <button
      type="button"
      aria-label="Open Date Planter"
      title="Open Date Planter"
      onPointerEnter={() => win.setPotHover(true)}
      onPointerLeave={() => !gesture.current && win.setPotHover(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onLostPointerCapture={onPointerUp}
      onKeyDown={(event) => event.key === 'Enter' && onOpen()}
      className={cn(
        'absolute h-24 w-20 -translate-x-1/2 -translate-y-full outline-none',
        leaving ? 'pointer-events-none animate-fade-out' : 'animate-pop',
      )}
      style={{ left: position.x, top: position.y }}
    >
      <Sprite slot="mini-pot" className="size-full transition hover:scale-105 hover:brightness-105" />
    </button>
  );
}
