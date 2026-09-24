import { Button } from '../ui/Field';
import { Panel } from '../ui/Panel';
import { DateMap } from './DateMap';

export function MapPanel({ dates, home, onSelectDate, onBack, onClose }) {
  const pinned = dates.filter((date) => date.place).length;
  return (
    <Panel
      title="Date map"
      closeLabel="Close map"
      onClose={onClose}
      scrollable={false}
      footer={
        <>
          <span className="mr-auto text-label text-card-text/70">
            {pinned} of {dates.length} dates pinned
          </span>
          <Button onClick={onBack}>Back</Button>
        </>
      }
    >
      <DateMap dates={dates} home={home} onSelectDate={onSelectDate} />
    </Panel>
  );
}
