import { emptyDateFields } from '../../lib/dates';
import { DateCard } from './DateCard';
import { DateDetails } from './DateDetails';
import { DateForm } from './DateForm';

export function DatePanel({ selection, date, onSubmit, onEdit, onDelete, onClose }) {
  if (selection.mode === 'new') {
    return (
      <DateCard heading="New date" onClose={onClose}>
        <DateForm initialFields={emptyDateFields()} onSubmit={onSubmit} onCancel={onClose} />
      </DateCard>
    );
  }
  if (!date) return null;
  if (selection.mode === 'edit') {
    return (
      <DateCard heading="Edit date" onClose={onClose}>
        <DateForm key={date.id} initialFields={{ ...emptyDateFields(), ...date }} onSubmit={onSubmit} onCancel={onClose} />
      </DateCard>
    );
  }
  return (
    <DateCard heading={date.title} onClose={onClose}>
      <DateDetails date={date} onEdit={onEdit} onDelete={onDelete} />
    </DateCard>
  );
}
