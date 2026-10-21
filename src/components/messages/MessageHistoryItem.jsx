import { useState } from 'react';
import { formatWhen } from '../../lib/dates';
import { isFromPerson, senderName } from '../../lib/messages';
import { Button } from '../ui/controls';
import { IconButton } from '../ui/IconButton';
import { ReplyQuote } from './ReplyQuote';

function status(message, mine) {
  if (mine) return message.readAt ? 'Read ✓' : 'Not read yet';
  return message.readAt ? 'Read' : 'New';
}

export function MessageHistoryItem({ message, me, recipient, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const mine = isFromPerson(message, me);
  const direction = mine ? `To ${recipient?.name ?? 'your partner'}` : `From ${senderName(message)}`;

  return (
    <li data-slot="message-history-item" className="rounded-lg bg-black/15 px-2 py-1.5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-label font-semibold uppercase tracking-wide text-card-accent">{direction}</p>
        {!confirming && (
          <IconButton icon="icon-delete" label="Delete message" onClick={() => setConfirming(true)} className="-mr-1 -mt-1 hover:bg-white/10" />
        )}
      </div>
      {message.replyTo && (
        <ReplyQuote
          replyTo={message.replyTo}
          label={mine ? `Replying to ${message.replyTo.name}:` : 'Replying to your message:'}
          tone="card"
        />
      )}
      <p className="mt-1 whitespace-pre-wrap break-words text-body">{message.text}</p>
      <p className="text-label text-card-text/70">
        {formatWhen(message.createdAt)} · {status(message, mine)}
      </p>
      {confirming && (
        <div className="mt-1.5 flex items-center justify-end gap-1">
          <span className="mr-auto text-label">Delete for both of you?</span>
          <Button variant="ghost" className="px-2 py-0.5" onClick={() => setConfirming(false)}>
            Keep
          </Button>
          <Button className="px-2 py-0.5" onClick={() => onDelete(message)}>
            Delete
          </Button>
        </div>
      )}
    </li>
  );
}
