import { useState } from 'react';
import { useBridge } from '../../api/BridgeContext';
import { canInvite, decodeInvite, encodeInvite } from '../../lib/invite';
import { readableError } from '../../lib/errors';
import { Button, Field, TextInput } from '../ui/controls';

const COPIED_MS = 2000;

export function CopyInviteButton({ storage }) {
  const { app } = useBridge();
  const [copied, setCopied] = useState(false);
  if (!canInvite(storage)) return null;

  async function copy() {
    await app.copyText(encodeInvite(storage));
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_MS);
  }

  return (
    <div className="flex items-center justify-between gap-2 text-label text-card-text/80">
      <span>Send this to your partner so their computer joins in one step.</span>
      <Button className="shrink-0 px-2 py-0.5" onClick={copy}>
        {copied ? 'Copied!' : 'Copy invite code'}
      </Button>
    </div>
  );
}

export function PasteInvite({ label = 'Invite code', onJoin }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [joining, setJoining] = useState(false);

  async function join() {
    try {
      const storage = decodeInvite(code);
      setError(null);
      setJoining(true);
      await onJoin(storage);
      setCode('');
    } catch (joinError) {
      setError(readableError(joinError));
    } finally {
      setJoining(false);
    }
  }

  return (
    <Field label={label} error={error}>
      <div className="flex gap-1">
        <TextInput
          value={code}
          placeholder="DP1.…"
          onChange={(event) => setCode(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && join()}
        />
        <Button className="shrink-0" disabled={joining || !code.trim()} onClick={join}>
          {joining ? 'Joining…' : 'Join'}
        </Button>
      </div>
    </Field>
  );
}
