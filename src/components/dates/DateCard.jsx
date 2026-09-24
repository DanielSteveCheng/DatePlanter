import { Surface } from '../../sprites/Surface';
import { ScrollArea } from '../ui/ScrollArea';
import { IconButton } from '../ui/IconButton';
import { cn } from '../../lib/cn';

const SUBHEADING_CLASSES = {
  upcoming: 'text-card-accent',
  past: 'text-card-text/60',
};

export function DateCard({ heading, subheading, tone, onClose, children }) {
  return (
    <Surface
      slot="date-card"
      className="absolute left-3 top-3 z-10 max-h-[calc(100%-1.5rem)] flex w-[52%] flex-col rounded-2xl border-2 border-black/30 bg-card p-2.5 text-card-text shadow-lg"
    >
      <div className="mb-1.5 flex items-start justify-between">
        <div>
          <h2 className="text-heading font-bold">{heading}</h2>
          {subheading && (
            <p data-slot="date-status" className={cn('text-label font-semibold uppercase tracking-wide', SUBHEADING_CLASSES[tone])}>
              {subheading}
            </p>
          )}
        </div>
        <IconButton icon="icon-close" label="Close date" onClick={onClose} className="-mt-0.5 hover:bg-white/10" />
      </div>
      <ScrollArea className="flex-1">{children}</ScrollArea>
    </Surface>
  );
}
