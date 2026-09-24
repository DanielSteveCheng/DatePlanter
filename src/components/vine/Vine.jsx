import { useMemo } from 'react';
import {
  VINE_LAYOUT,
  budPosition,
  hiddenBelow,
  lastStemKnot,
  layoutLeaves,
  maxScroll,
  stemOffsetY,
  wheelPixels,
} from '../../lib/vine';
import { useElementHeight } from '../../hooks/useElementHeight';
import { useMomentumScroll } from '../../hooks/useMomentumScroll';
import { useNewIds } from '../../hooks/useNewIds';
import { Leaf } from './Leaf';
import { Stem } from './Stem';
import { Bud } from './Bud';

export function Vine({ dates, selectedId, onSelectDate, onPlant }) {
  const [containerRef, height] = useElementHeight();
  const ids = useMemo(() => dates.map((date) => date.id), [dates]);
  const leaves = useMemo(() => layoutLeaves(ids), [ids]);
  const titles = useMemo(() => Object.fromEntries(dates.map((date) => [date.id, date.title])), [dates]);
  const newIds = useNewIds(ids);
  const { scroll, push, glideBy } = useMomentumScroll(maxScroll(ids.length, height));
  const isEmpty = ids.length === 0;
  const olderCount = hiddenBelow(ids.length, scroll, height);

  return (
    <div
      ref={containerRef}
      onWheel={(event) => push(wheelPixels(event))}
      data-slot="vine"
      className="absolute inset-y-0 origin-bottom animate-vine-sway"
      style={{ right: VINE_LAYOUT.right, width: VINE_LAYOUT.width }}
    >
      <div className="absolute inset-0 will-change-transform" style={{ transform: `translate3d(0, ${-scroll}px, 0)` }}>
        {height > 0 && (
          <Stem
            fromKnot={isEmpty ? 0 : -1}
            toKnot={lastStemKnot(ids.length, height)}
            offsetY={stemOffsetY(ids.length, height)}
          />
        )}
        {isEmpty && height > 0 && <Bud {...budPosition(height)} onClick={onPlant} />}
        {leaves.map(({ id, index, side, x, y }) => (
          <Leaf
            key={id}
            id={id}
            index={index}
            side={side}
            x={x}
            y={y}
            isNew={newIds.has(id)}
            variant={id === selectedId ? 'selected' : 'leaf'}
            label={titles[id]}
            onSelect={onSelectDate}
          />
        ))}
      </div>
      {scroll > 0.5 && <ScrollHint position="top" onClick={() => glideBy(-VINE_LAYOUT.spacing)} label="Newer" />}
      {olderCount > 0 && (
        <ScrollHint position="bottom" onClick={() => glideBy(VINE_LAYOUT.spacing)} label={`${olderCount} older`} />
      )}
    </div>
  );
}

function ScrollHint({ position, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute left-1/2 -translate-x-1/2 rounded-full bg-black/20 px-2 text-label font-semibold text-white hover:bg-black/30 ${position === 'top' ? 'top-1' : 'bottom-1'}`}
    >
      {position === 'top' ? '▲' : '▼'} {label}
    </button>
  );
}
