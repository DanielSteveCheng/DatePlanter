import { useState } from 'react';
import { DATE_TYPES, validateDate } from '../../lib/dates';
import { Button, Field, Select, TextArea, TextInput } from '../ui/Field';

export function DateForm({ initialFields, onSubmit, onCancel }) {
  const [fields, setFields] = useState(initialFields);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const bind = (name) => ({
    value: fields[name],
    onChange: (event) => setFields((current) => ({ ...current, [name]: event.target.value })),
  });

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateDate(fields);
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
      <Field label="Title" error={errors.title}>
        <TextInput autoFocus {...bind('title')} />
      </Field>
      <Field label="Where">
        <TextInput {...bind('where')} />
      </Field>
      <Field label="When" error={errors.when}>
        <TextInput type="datetime-local" {...bind('when')} />
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
