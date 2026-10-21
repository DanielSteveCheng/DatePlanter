import { useState } from 'react';
import { Button, Checkbox, Field, Select, TextInput } from '../ui/controls';
import { Panel } from '../ui/Panel';
import { Section } from '../ui/Section';
import { LocationPicker } from './LocationPicker';
import { StorageSettings } from './StorageSettings';

export function SettingsPanel({ settings, identity, onSave, onClose, onOpenStats, onOpenMap }) {
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
          <Field label="Your name (shared with both computers)">
            <TextInput value={draft.author} onChange={(e) => set({ author: e.target.value })} />
          </Field>
          <div className="flex items-center justify-between gap-2 text-label text-card-text/80">
            <span>
              {identity.partner ? `Sharing with ${identity.partner.name}` : 'Waiting for your partner to set up their plant'}
            </span>
            <Button variant="ghost" className="px-2 py-0.5" onClick={identity.leave}>
              Switch person
            </Button>
          </div>
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
