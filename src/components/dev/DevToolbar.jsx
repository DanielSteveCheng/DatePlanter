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

const count = (n, one, many) => `${n} ${n === 1 ? one : many}`;

export function DevToolbar({ dev, weatherPreview }) {
  return (
    <div
      data-slot="dev-toolbar"
      className="mb-1.5 flex shrink-0 flex-wrap items-center gap-0.5 rounded-lg bg-black/60 p-1 text-label text-white"
    >
      <span className="px-1 font-bold">DEV</span>
      {['live', ...CONDITIONS].map((condition) => (
        <Chip key={condition} active={weatherPreview === condition} onClick={() => dev.preview(condition)}>
          {condition}
        </Chip>
      ))}
      <Chip active={dev.showSlots} onClick={dev.toggleSlots}>
        slots
      </Chip>
      <span className="mx-0.5 h-3 w-px bg-white/30" />
      <Chip onClick={() => dev.addDates(1)}>+1 leaf</Chip>
      <Chip onClick={() => dev.addDates(5)}>+5</Chip>
      {dev.dates.length > 0 && <Chip onClick={dev.clearDates}>clear {count(dev.dates.length, 'leaf', 'leaves')}</Chip>}
      <Chip onClick={dev.addMessage}>+message</Chip>
      {dev.messages.length > 0 && <Chip onClick={dev.clearMessages}>clear {count(dev.messages.length, 'message', 'messages')}</Chip>}
    </div>
  );
}
