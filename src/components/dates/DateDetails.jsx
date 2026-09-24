import { useState } from 'react';
import { formatWhen, typeLabel } from '../../lib/dates';
import { placeLabel } from '../../lib/places';
import { Button } from '../ui/Field';

function Detail({ label, value, hint }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-label font-semibold uppercase tracking-wide text-card-text/70">{label}</dt>
      <dd className="whitespace-pre-wrap break-words text-body">{value}</dd>
      {hint && <dd className="break-words text-label text-card-text/70">{hint}</dd>}
    </div>
  );
}

export function DateDetails({ date, onEdit, onDelete }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <dl className="flex flex-col gap-1.5">
        <Detail label="Where" value={placeLabel(date)} hint={date.place?.address} />
        <Detail label="When" value={formatWhen(date.when)} />
        <Detail label="Type" value={typeLabel(date.type)} />
        <Detail label="Activities" value={date.activities} />
        <Detail label="Notes" value={date.notes} />
        <Detail label="Planted by" value={date.author} />
      </dl>
      {confirmingDelete ? (
        <div className="flex items-center justify-end gap-1">
          <span className="mr-auto text-body">Pull this leaf?</span>
          <Button variant="ghost" onClick={() => setConfirmingDelete(false)}>
            Keep
          </Button>
          <Button onClick={onDelete}>Pull</Button>
        </div>
      ) : (
        <div className="flex justify-end gap-1">
          <Button variant="danger" onClick={() => setConfirmingDelete(true)}>
            Delete
          </Button>
          <Button onClick={onEdit}>Edit</Button>
        </div>
      )}
    </div>
  );
}
