import { useState } from 'react';
import { DATE_TYPES, toDateTimeInputValue, validateDate } from '../../lib/dates';
import { Button, Field, Select, TextArea, TextInput } from '../ui/Field';
import { LocationField } from './LocationField';

export function DateForm({ initialFields, allowPast = true, near, onSubmit, onCancel }) {
  const [fields, setFields] = useState(initialFields);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const bind = (name) => ({
    value: fields[name],
    onChange: (event) => setFields((current) => ({ ...current, [name]: event.target.value })),
  });

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateDate(fields, { allowPast });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSaving(true);
    try {
      await onSubmit(fields);
    } catch {
      return;
    } finally {
      setSaving(false);
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-1.5">
      <Field label="Title" error={errors.title}>
        <TextInput autoFocus {...bind('title')} />
      </Field>
      <LocationField
        where={fields.where}
        place={fields.place}
        near={near}
        onChange={(patch) => setFields((current) => ({ ...current, ...patch }))}
      />
      <Field label="When" error={errors.when}>
        <TextInput type="datetime-local" min={allowPast ? undefined : toDateTimeInputValue(new Date())} {...bind('when')} />
      </Field>
      <Field label="Type">
        <Select {...bind('type')}>
          {DATE_TYPES.map((type) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Activities">
        <TextArea {...bind('activities')} />
      </Field>
      <Field label="Notes">
        <TextArea {...bind('notes')} />
      </Field>
      <div className="flex justify-end gap-1 pt-1">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Planting…' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
