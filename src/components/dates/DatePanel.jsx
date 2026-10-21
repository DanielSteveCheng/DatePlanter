import { DATE_STATUS_LABELS, dateStatus, emptyDateFields } from '../../lib/dates';
import { DateCard } from './DateCard';
import { DateDetails } from './DateDetails';
import { DateForm } from './DateForm';

export function DatePanel({ selection, date, near, onSubmit, onEdit, onDelete, onClose }) {
  if (selection.mode === 'new') {
    return (
      <DateCard key="new" heading="New date" onClose={onClose}>
        <DateForm initialFields={emptyDateFields()} allowPast={false} near={near} onSubmit={onSubmit} onCancel={onClose} />
      </DateCard>
    );
  }
  if (!date) return null;
  if (selection.mode === 'edit') {
    return (
      <DateCard key={`edit-${date.id}`} heading="Edit date" onClose={onClose}>
        <DateForm
          key={date.id}
          initialFields={{ ...emptyDateFields(), ...date }}
          near={near}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </DateCard>
    );
  }
  const status = dateStatus(date);
  return (
    <DateCard
      key={`view-${date.id}`}
      heading={date.title}
      subheading={DATE_STATUS_LABELS[status]}
      tone={status}
      onClose={onClose}
    >
      <DateDetails key={date.id} date={date} onEdit={onEdit} onDelete={onDelete} />
    </DateCard>
  );
}
