import { useState } from 'react';
import { Button, Checkbox, Field, Select, TextInput } from '../ui/Field';
import { Panel } from '../ui/Panel';
import { LocationPicker } from './LocationPicker';
import { StorageSettings } from './StorageSettings';

function Section({ title, children }) {
  return (
    <section className="flex flex-col gap-1.5">
      <h3 className="text-body font-bold text-card-accent">{title}</h3>
      {children}
    </section>
  );
}

export function SettingsPanel({ settings, onSave, onClose, onOpenStats, onOpenMap }) {
  const [draft, setDraft] = useState(settings);
  const set = (patch) => setDraft((current) => ({ ...current, ...patch }));

  return (
    <Panel
      title="Settings"
      closeLabel="Close settings"
      onClose={onClose}
      actions={
        <>
          <Button onClick={onOpenStats}>Stats</Button>
          <Button onClick={onOpenMap}>Map</Button>
        </>
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(draft)}>Save</Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
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
        </Section>
        <Section title="Sharing">
          <StorageSettings storage={draft.storage} onChange={(storage) => set({ storage: { ...draft.storage, ...storage } })} />
        </Section>
        <Section title="Window">
          <Field label="Keep on top of other windows">
            <Select value={draft.keepOnTop} onChange={(e) => set({ keepOnTop: e.target.value })}>
              <option value="pot">Only the pot</option>
              <option value="always">Always</option>
              <option value="never">Never</option>
            </Select>
          </Field>
        </Section>
        <Section title="Developer">
          <Checkbox checked={draft.devMode} onChange={(e) => set({ devMode: e.target.checked })}>
            Developer mode (Ctrl+Shift+D)
          </Checkbox>
        </Section>
      </div>
    </Panel>
  );
}
