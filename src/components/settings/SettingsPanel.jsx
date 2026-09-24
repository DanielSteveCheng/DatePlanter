import { useState } from 'react';
import { CONDITIONS } from '../../lib/weather';
import { Button, Field, Select, TextInput } from '../ui/Field';
import { LocationPicker } from './LocationPicker';
import { StorageSettings } from './StorageSettings';

function Section({ title, children }) {
  return (
    <section className="flex flex-col gap-1.5">
      <h3 className="text-xs font-bold text-card-accent">{title}</h3>
      {children}
    </section>
  );
}

export function SettingsPanel({ settings, onSave, onClose }) {
  const [draft, setDraft] = useState(settings);
  const set = (patch) => setDraft((current) => ({ ...current, ...patch }));

  return (
    <div className="absolute inset-0 z-20 flex flex-col rounded-2xl bg-card p-3 text-card-text">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-bold">Settings</h2>
        <button type="button" aria-label="Close settings" onClick={onClose} className="rounded px-1 text-xs hover:bg-white/10">
          ✕
        </button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
        <Section title="You">
          <Field label="Your name">
            <TextInput value={draft.author} onChange={(e) => set({ author: e.target.value })} />
          </Field>
        </Section>
        <Section title="Weather">
          <LocationPicker location={draft.location} onChange={(location) => set({ location })} />
          <Field label="Units">
            <Select value={draft.units} onChange={(e) => set({ units: e.target.value })}>
              <option value="fahrenheit">Fahrenheit</option>
              <option value="celsius">Celsius</option>
            </Select>
          </Field>
          <Field label="Preview weather">
            <Select value={draft.weatherPreview} onChange={(e) => set({ weatherPreview: e.target.value })}>
              <option value="live">Live</option>
              {CONDITIONS.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </Select>
          </Field>
        </Section>
        <Section title="Sharing">
          <StorageSettings storage={draft.storage} onChange={(storage) => set({ storage: { ...draft.storage, ...storage } })} />
        </Section>
      </div>
      <div className="flex justify-end gap-1 pt-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => onSave(draft)}>Save</Button>
      </div>
    </div>
  );
}
