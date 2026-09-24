import { cn } from '../../lib/cn';
import { originAt } from '../../hooks/useMiniMode';
import { MiniPot } from './MiniPot';

const PHASE_CLASSES = {
  full: '',
  collapsing: 'animate-shrink',
  mini: 'invisible pointer-events-none',
  expanding: 'animate-grow',
};

export function WindowShell({ phase, pot, onAnimationEnd, onExpand, children }) {
  const showPot = phase === 'mini' || phase === 'expanding';

  return (
    <div className="relative h-full">
      <div
        className={cn('h-full', PHASE_CLASSES[phase])}
        style={{ transformOrigin: originAt(pot) }}
        onAnimationEnd={(event) => event.target === event.currentTarget && onAnimationEnd()}
      >
        {children}
      </div>
      {showPot && <MiniPot position={pot} leaving={phase === 'expanding'} onOpen={onExpand} />}
    </div>
  );
}
