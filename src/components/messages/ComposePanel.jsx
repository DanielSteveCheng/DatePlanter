import { MESSAGE_MAX_LENGTH } from '../../lib/messages';
import { Button, Field, TextArea } from '../ui/controls';
import { Panel } from '../ui/Panel';
import { Section } from '../ui/Section';
import { MessageHistoryItem } from './MessageHistoryItem';
import { useMessageDraft } from './useMessageDraft';

const RECENT_LIMIT = 10;

const SENT_TEXT = 'Sent! It will bloom as a bud on their plant.';

export function ComposePanel({ conversation, me, recipient, onSend, onDelete, onClose }) {
  const draft = useMessageDraft(onSend);

  return (
    <Panel
      title="Send a message"
      closeLabel="Close messages"
      onClose={onClose}
      footer={
        <>
          <span className="mr-auto text-label text-card-text/70">
            {draft.text.trim().length}/{MESSAGE_MAX_LENGTH}
          </span>
          <Button onClick={draft.send} disabled={draft.sending || !recipient}>
            {draft.sending ? 'Sending…' : 'Send'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        {recipient ? (
          <p data-slot="message-recipient" className="text-body">
            To <b>{recipient.name}</b>. It appears as a little bud on their plant.
          </p>
        ) : (
          <p className="text-body text-card-accent">
            Your partner hasn't set up their plant yet. Once they open Date Planter and add their name, you can send them
            messages.
          </p>
        )}
        <Field label={recipient ? `Message to ${recipient.name}` : 'Message'} error={draft.error}>
          <TextArea
            autoFocus
            disabled={!recipient}
            value={draft.text}
            maxLength={MESSAGE_MAX_LENGTH}
            onChange={(event) => draft.edit(event.target.value)}
          />
        </Field>
        {draft.sent && <p className="text-label text-card-accent">{SENT_TEXT}</p>}
        {conversation.length > 0 && (
          <Section title="Recent messages" className="mt-1 flex flex-col gap-1.5">
            <ul className="flex flex-col gap-1.5">
              {conversation.slice(0, RECENT_LIMIT).map((message) => (
                <MessageHistoryItem key={message.id} message={message} me={me} recipient={recipient} onDelete={onDelete} />
              ))}
            </ul>
          </Section>
        )}
      </div>
    </Panel>
  );
}
