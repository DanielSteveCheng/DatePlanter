import { MESSAGE_MAX_LENGTH } from '../../lib/messages';
import { formatWhen } from '../../lib/dates';
import { Button, Field, TextArea } from '../ui/controls';
import { Panel } from '../ui/Panel';
import { Section } from '../ui/Section';
import { ReplyQuote } from './ReplyQuote';
import { useMessageDraft } from './useMessageDraft';

const RECENT_LIMIT = 5;

const SENT_TEXT = 'Sent! It will bloom as a bud on their plant.';

export function ComposePanel({ sent, hasName, onSend, onClose }) {
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
          <Button onClick={draft.send} disabled={draft.sending}>
            {draft.sending ? 'Sending…' : 'Send'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        <p className="text-body">Your message appears as a little bud on the other plant.</p>
        {!hasName && <p className="text-label text-card-accent">Tip: add your name in Settings so they know it's from you.</p>}
        <Field label="Message" error={draft.error}>
          <TextArea
            autoFocus
            value={draft.text}
            maxLength={MESSAGE_MAX_LENGTH}
            onChange={(event) => draft.edit(event.target.value)}
          />
        </Field>
        {draft.sent && <p className="text-label text-card-accent">{SENT_TEXT}</p>}
        {sent.length > 0 && (
          <Section title="Recently sent" className="mt-1 flex flex-col gap-1.5">
            <ul className="flex flex-col gap-1.5">
              {sent.slice(0, RECENT_LIMIT).map((message) => (
                <li key={message.id} className="rounded-lg bg-black/15 px-2 py-1.5">
                  {message.replyTo && (
                    <ReplyQuote replyTo={message.replyTo} label={`Replying to ${message.replyTo.name}:`} tone="card" />
                  )}
                  <p className="mt-1 whitespace-pre-wrap break-words text-body">{message.text}</p>
                  <p className="text-label text-card-text/70">
                    {formatWhen(message.createdAt)} · {message.readAt ? 'Read ✓' : 'Not read yet'}
                  </p>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </Panel>
  );
}
