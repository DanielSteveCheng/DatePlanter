import { cn } from '../../lib/cn';
import { IconButton } from './IconButton';

const SUBTITLE_TONES = {
  upcoming: 'text-card-accent',
  past: 'text-card-text/60',
};

export function CardHeader({ title, subtitle, tone, actions, closeLabel, onClose, className }) {
  return (
    <div className={cn('flex items-start justify-between gap-2', className)}>
      <div className="min-w-0">
        <h2 className="text-heading font-bold">{title}</h2>
        {subtitle && (
          <p data-slot="date-status" className={cn('text-label font-semibold uppercase tracking-wide', SUBTITLE_TONES[tone])}>
            {subtitle}
          </p>
        )}
      </div>
      <div className="-mt-0.5 flex items-center gap-1">
        {actions}
        <IconButton icon="icon-close" label={closeLabel} onClick={onClose} className="hover:bg-white/10" />
      </div>
    </div>
  );
}
