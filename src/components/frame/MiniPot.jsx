import { useRef, useState } from 'react';
import { useBridge } from '../../api/BridgeContext';
import { Sprite } from '../../sprites/Sprite';
import { cn } from '../../lib/cn';
import { pickLoadingMessage } from '../../lib/loadingMessages';

const DRAG_THRESHOLD_PX = 4;

const STATE_CLASSES = {
  waiting: 'pointer-events-none animate-bob',
  resting: 'animate-pop',
  leaving: 'pointer-events-none animate-fade-out',
};

export function MiniPot({ position, state, onOpen }) {
  const { window: win } = useBridge();
  const gesture = useRef(null);
  const [loadingMessage] = useState(() => pickLoadingMessage());

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
      aria-label={state === 'waiting' ? 'Loading Date Planter' : 'Open Date Planter'}
      title={state === 'waiting' ? 'Loading…' : 'Open Date Planter'}
      onPointerEnter={() => win.setPotHover(true)}
      onPointerLeave={() => !gesture.current && win.setPotHover(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onLostPointerCapture={onPointerUp}
      onKeyDown={(event) => event.key === 'Enter' && onOpen()}
      className={cn(
        'absolute h-24 w-20 -translate-x-1/2 -translate-y-full outline-none',
        STATE_CLASSES[state],
      )}
      style={{ left: position.x, top: position.y }}
    >
      {state === 'waiting' && (
        <span className="absolute bottom-full left-1/2 mb-2 flex -translate-x-1/2 flex-col items-center gap-1.5">
          <span
            data-slot="loading-message"
            className="whitespace-nowrap rounded-full bg-bubble-fill px-2.5 py-0.5 text-bubble font-bold text-bubble-ink shadow-md"
          >
            {loadingMessage}
          </span>
          <Sprite slot="loading-spinner" className="size-7 animate-spin" />
        </span>
      )}
      <Sprite slot="mini-pot" className="size-full transition hover:scale-105 hover:brightness-105" />
    </button>
  );
}
