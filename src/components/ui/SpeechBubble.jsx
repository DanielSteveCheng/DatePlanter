import { Surface } from '../../sprites/Surface';
import { cn } from '../../lib/cn';

const TAILS = {
  down: 'left-1/2 top-full -translate-x-1/2 border-x-[7px] border-t-[7px] border-x-transparent border-t-bubble-fill',
  up: 'left-1/2 bottom-full -translate-x-1/2 border-x-[7px] border-b-[7px] border-x-transparent border-b-bubble-fill',
  right: 'left-full top-4 border-y-[7px] border-l-[7px] border-y-transparent border-l-bubble-fill',
};

export function SpeechBubble({ slot, tail, tailTop, className, children, ...props }) {
  return (
    <Surface slot={slot} className={cn('relative bg-bubble-fill text-bubble-ink shadow-md', className)} {...props}>
      {children}
      {tail && <span className={cn('absolute', TAILS[tail])} style={tailTop === undefined ? undefined : { top: tailTop }} />}
    </Surface>
  );
}
