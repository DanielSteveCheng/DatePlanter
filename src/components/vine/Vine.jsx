import { useEffect, useRef, useState } from 'react';
import { Surface } from '../../sprites/Surface';
import { clampScroll, layoutLeaves, maxScroll, visibleLeafCount } from '../../lib/vine';
import { useElementHeight } from '../../hooks/useElementHeight';
import { useNewIds } from '../../hooks/useNewIds';
import { Leaf } from './Leaf';

export const SPROUT_ID = 'sprout';

export function Vine({ dates, selectedId, onSelectDate, onSprout }) {
  const [containerRef, height] = useElementHeight();
  const [scroll, setScroll] = useState(0);
  const ids = [SPROUT_ID, ...dates.map((date) => date.id)];
  const visible = visibleLeafCount(height);
  const hiddenBelow = maxScroll(ids.length, visible) - scroll;
  const newIds = useNewIds(ids);
  const datesById = Object.fromEntries(dates.map((date) => [date.id, date]));

  const scrollBy = (delta) => setScroll((current) => clampScroll(current + delta, ids.length, visible));
  const lastWheel = useRef(0);

  useEffect(() => setScroll((current) => clampScroll(current, ids.length, visible)), [ids.length, visible]);

  function onWheel(event) {
    const now = Date.now();
    if (now - lastWheel.current < 150) return;
    lastWheel.current = now;
    scrollBy(Math.sign(event.deltaY));
  }

  return (
    <div ref={containerRef} onWheel={onWheel} data-slot="vine" className="absolute inset-y-0 right-3 w-36">
      <Surface slot="stem" className="absolute inset-y-0 left-1/2 w-2.5 -translate-x-1/2 bg-stem" />
      {layoutLeaves(ids, scroll).map(({ id, index, side, y }) => {
        const date = datesById[id];
        return (
          <Leaf
            key={id}
            index={index}
            side={side}
            y={y}
            isNew={newIds.has(id)}
            variant={id === SPROUT_ID ? 'sprout' : id === selectedId ? 'selected' : 'leaf'}
            label={date ? date.title : 'Plant a new date'}
            onClick={() => (date ? onSelectDate(date.id) : onSprout())}
          />
        );
      })}
      {scroll > 0 && <ScrollHint position="top" onClick={() => scrollBy(-1)} label="Newer" />}
      {hiddenBelow > 0 && <ScrollHint position="bottom" onClick={() => scrollBy(1)} label={`${hiddenBelow} older`} />}
    </div>
  );
}

function ScrollHint({ position, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute left-1/2 -translate-x-1/2 rounded-full bg-black/20 px-2 text-[10px] font-semibold text-white hover:bg-black/30 ${position === 'top' ? 'top-1' : 'bottom-1'}`}
    >
      {position === 'top' ? '▲' : '▼'} {label}
    </button>
  );
}
