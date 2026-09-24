import { useBridge } from '../../api/BridgeContext';
import { Button, Field, Select, TextInput } from '../ui/Field';

export function StorageSettings({ storage, onChange }) {
  const bridge = useBridge();

  async function chooseFolder() {
    const filePath = await bridge.settings.chooseFolder();
    if (filePath) onChange({ filePath });
  }

  return (
    <>
      <Field label="Share through">
        <Select value={storage.type} onChange={(e) => onChange({ type: e.target.value })}>
          <option value="file">Shared folder (Dropbox, Drive, iCloud…)</option>
          <option value="supabase">Supabase</option>
        </Select>
      </Field>
      {storage.type === 'file' ? (
        <Field label="Garden file">
          <div className="flex gap-1">
            <TextInput value={storage.filePath} placeholder="This computer only" onChange={(e) => onChange({ filePath: e.target.value })} />
            <Button onClick={chooseFolder}>Pick</Button>
          </div>
        </Field>
      ) : (
        <>
          <Field label="Project URL">
            <TextInput value={storage.supabaseUrl} placeholder="https://xyz.supabase.co" onChange={(e) => onChange({ supabaseUrl: e.target.value })} />
          </Field>
          <Field label="Publishable (anon) key">
            <TextInput type="password" value={storage.supabaseKey} onChange={(e) => onChange({ supabaseKey: e.target.value })} />
          </Field>
        </>
      )}
    </>
  );
}
