import { Surface } from '../../sprites/Surface';
import { CardHeader } from './CardHeader';
import { ScrollArea } from './ScrollArea';

export function Panel({ title, closeLabel, onClose, actions, footer, scrollable = true, children }) {
  return (
    <Surface slot="panel" className="absolute inset-0 z-20 flex flex-col rounded-2xl bg-card p-3 text-card-text">
      <CardHeader title={title} actions={actions} closeLabel={closeLabel} onClose={onClose} className="mb-2" />
      {scrollable ? <ScrollArea className="flex-1">{children}</ScrollArea> : <div className="min-h-0 flex-1">{children}</div>}
      {footer && <div className="flex justify-end gap-1 pt-2">{footer}</div>}
    </Surface>
  );
}
