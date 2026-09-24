import { Sprite } from '../../sprites/Sprite';
import { cn } from '../../lib/cn';

const SIDE_CLASSES = {
  right: 'left-1/2 origin-left',
  left: 'right-1/2 origin-right',
};

const SLOT_FOR_VARIANT = {
  sprout: 'leaf-sprout',
  selected: 'leaf-selected',
  leaf: 'leaf',
};

export function Leaf({ label, side, y, index, variant, isNew, onClick }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 transition-[top] duration-700 ease-out" style={{ top: y }}>
      <button
        type="button"
        aria-label={label}
        title={label}
        onClick={onClick}
        className={cn('pointer-events-auto absolute top-0 block w-16 animate-sway', SIDE_CLASSES[side])}
        style={{ animationDelay: `${-index * 0.7}s` }}
      >
        <span className={cn('block', side === 'left' && '-scale-x-100')}>
          <Sprite
            slot={SLOT_FOR_VARIANT[variant]}
            className={cn('block w-full origin-left transition hover:brightness-110', isNew && 'animate-sprout')}
          />
        </span>
      </button>
    </div>
  );
}
