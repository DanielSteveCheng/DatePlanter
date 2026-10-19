import { MESSAGE_MAX_LENGTH } from '../../lib/messages';
import { Button, TextArea } from '../ui/controls';
import { useMessageDraft } from './useMessageDraft';

export function ReplyForm({ to, onSend, onCancel }) {
  const draft = useMessageDraft(onSend);

  return (
    <div className="mt-2 flex flex-col gap-1.5">
      <TextArea
        tone="bubble"
        autoFocus
        aria-label={`Reply to ${to}`}
        placeholder={`Reply to ${to}…`}
        value={draft.text}
        maxLength={MESSAGE_MAX_LENGTH}
        onChange={(event) => draft.edit(event.target.value)}
        onKeyDown={(event) => (event.ctrlKey || event.metaKey) && event.key === 'Enter' && draft.send()}
      />
      {draft.error && <p className="text-label text-red-700">{draft.error}</p>}
      <div className="flex justify-end gap-1">
        <Button variant="bubble-ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="bubble" onClick={draft.send} disabled={draft.sending}>
          {draft.sending ? 'Sending…' : 'Send'}
        </Button>
      </div>
    </div>
  );
}
