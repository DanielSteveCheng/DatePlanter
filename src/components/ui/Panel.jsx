import { Surface } from '../../sprites/Surface';
import { ScrollArea } from './ScrollArea';
import { IconButton } from './IconButton';

export function Panel({ title, closeLabel, onClose, actions, footer, scrollable = true, children }) {
  return (
    <Surface slot="panel" className="absolute inset-0 z-20 flex flex-col rounded-2xl bg-card p-3 text-card-text">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-heading font-bold">{title}</h2>
        <div className="flex items-center gap-1">
          {actions}
          <IconButton icon="icon-close" label={closeLabel} onClick={onClose} className="hover:bg-white/10" />
        </div>
      </div>
      {scrollable ? <ScrollArea className="flex-1">{children}</ScrollArea> : <div className="min-h-0 flex-1">{children}</div>}
      {footer && <div className="flex justify-end gap-1 pt-2">{footer}</div>}
    </Surface>
  );
}
