import { Sprite } from '../../sprites/Sprite';
import { squareSize } from '../../sprites/sizes';
import { cn } from '../../lib/cn';

export function IconButton({ icon, label, onClick, className }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => onClick()}
      className={cn('grid shrink-0 place-items-center rounded-md', className)}
      style={squareSize('title-button')}
    >
      <Sprite slot={icon} style={squareSize('title-icon')} />
    </button>
  );
}
