import { formatWhen, typeLabel } from '../../lib/dates';
import { Button } from '../ui/Field';

function Detail({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-card-text/70">{label}</dt>
      <dd className="whitespace-pre-wrap break-words text-xs">{value}</dd>
    </div>
  );
}

export function DateDetails({ date, onEdit, onDelete }) {
  return (
    <div className="flex flex-col gap-2">
      <dl className="flex flex-col gap-1.5">
        <Detail label="Where" value={date.where} />
        <Detail label="When" value={formatWhen(date.when)} />
        <Detail label="Type" value={typeLabel(date.type)} />
        <Detail label="Activities" value={date.activities} />
        <Detail label="Notes" value={date.notes} />
        <Detail label="Planted by" value={date.author} />
      </dl>
      <div className="flex justify-end gap-1">
        <Button variant="danger" onClick={onDelete}>
          Delete
        </Button>
        <Button onClick={onEdit}>Edit</Button>
      </div>
    </div>
  );
}
