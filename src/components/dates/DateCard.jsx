import { Surface } from '../../sprites/Surface';
import { CardHeader } from '../ui/CardHeader';
import { ScrollArea } from '../ui/ScrollArea';

export function DateCard({ heading, subheading, tone, onClose, children }) {
  return (
    <Surface
      slot="date-card"
      className="absolute left-3 top-3 z-10 flex max-h-[calc(100%-1.5rem)] w-[52%] flex-col rounded-2xl border-2 border-black/30 bg-card p-2.5 text-card-text shadow-lg"
    >
      <CardHeader title={heading} subtitle={subheading} tone={tone} closeLabel="Close date" onClose={onClose} className="mb-1.5" />
      <ScrollArea className="flex-1">{children}</ScrollArea>
    </Surface>
  );
}
