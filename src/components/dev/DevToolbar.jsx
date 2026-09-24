import { CONDITIONS } from '../../lib/weather';
import { cn } from '../../lib/cn';

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('rounded px-1.5 py-0.5 capitalize', active ? 'bg-white text-black' : 'hover:bg-white/20')}
    >
      {children}
    </button>
  );
}

export function DevToolbar({ weatherPreview, onPreview, showSlots, onToggleSlots, leafCount, onAddLeaves, onClearLeaves }) {
  return (
    <div
      data-slot="dev-toolbar"
      className="mb-1.5 flex shrink-0 flex-wrap items-center gap-0.5 rounded-lg bg-black/60 p-1 text-label text-white"
    >
      <span className="px-1 font-bold">DEV</span>
      {['live', ...CONDITIONS].map((condition) => (
        <Chip key={condition} active={weatherPreview === condition} onClick={() => onPreview(condition)}>
          {condition}
        </Chip>
      ))}
      <Chip active={showSlots} onClick={onToggleSlots}>
        slots
      </Chip>
      <span className="mx-0.5 h-3 w-px bg-white/30" />
      <Chip onClick={() => onAddLeaves(1)}>+1 leaf</Chip>
      <Chip onClick={() => onAddLeaves(5)}>+5</Chip>
      {leafCount > 0 && <Chip onClick={onClearLeaves}>clear {leafCount}</Chip>}
    </div>
  );
}
