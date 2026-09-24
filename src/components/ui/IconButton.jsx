import { Sprite } from '../../sprites/Sprite';
import { cn } from '../../lib/cn';

export function IconButton({ icon, label, onClick, className }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => onClick()}
      className={cn('grid size-6 shrink-0 place-items-center rounded-md', className)}
    >
      <Sprite slot={icon} className="size-3.5" />
    </button>
  );
}
