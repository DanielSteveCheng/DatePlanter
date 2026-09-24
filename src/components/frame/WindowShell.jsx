import { cn } from '../../lib/cn';
import { originAt } from '../../hooks/useMiniMode';
import { MiniPot } from './MiniPot';

const PHASE_CLASSES = {
  loading: 'invisible pointer-events-none',
  full: '',
  collapsing: 'animate-shrink',
  mini: 'invisible pointer-events-none',
  expanding: 'animate-grow',
};

const POT_STATES = { loading: 'waiting', mini: 'resting', expanding: 'leaving' };

export function WindowShell({ phase, pot, onAnimationEnd, onExpand, children }) {
  const showPot = phase !== 'full' && phase !== 'collapsing';

  return (
    <div className="relative h-full">
      <div
        className={cn('h-full', PHASE_CLASSES[phase])}
        style={{ transformOrigin: originAt(pot) }}
        onAnimationEnd={(event) => event.target === event.currentTarget && onAnimationEnd()}
      >
        {children}
      </div>
      {showPot && <MiniPot position={pot} state={POT_STATES[phase]} onOpen={onExpand} />}
    </div>
  );
}
