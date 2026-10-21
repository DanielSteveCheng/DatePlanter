import { useState } from 'react';
import { spriteSize } from '../../sprites/sizes';
import { formatWhen } from '../../lib/dates';
import { senderName } from '../../lib/messages';
import { Button } from '../ui/controls';
import { IconButton } from '../ui/IconButton';
import { ScrollArea } from '../ui/ScrollArea';
import { SpeechBubble } from '../ui/SpeechBubble';
import { ReplyForm } from './ReplyForm';
import { ReplyQuote } from './ReplyQuote';

export function MessageBubble({ message, waiting, tail, tailTop, maxHeight, onClose, onReply }) {
  const [replying, setReplying] = useState(false);
  const name = senderName(message);

  return (
    <SpeechBubble
      slot="message-bubble"
      tail={tail}
      tailTop={tailTop}
      role="dialog"
      aria-label={`Message from ${name}`}
      className="flex flex-col rounded-2xl p-2 shadow-lg"
      style={{ ...spriteSize('message-bubble'), maxHeight }}
    >
      <div className="flex shrink-0 items-start justify-between gap-2 px-1 pt-1">
        <div>
          <p className="text-label font-bold uppercase tracking-wide">From {name}</p>
          <p className="text-label opacity-60">{formatWhen(message.createdAt)}</p>
        </div>
        <IconButton icon="icon-close" label="Close message" onClick={onClose} className="-mr-0.5 -mt-0.5 hover:bg-black/5" />
      </div>
      <ScrollArea className="flex-1">
        {message.replyTo && <ReplyQuote replyTo={message.replyTo} label="Replying to your message:" />}
        <p className="mt-1.5 whitespace-pre-wrap break-words text-body">{message.text}</p>
        {replying ? (
          <ReplyForm to={name} onSend={onReply} onCancel={() => setReplying(false)} />
        ) : (
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <span className="text-label opacity-60">{waiting > 0 ? `${waiting} more waiting` : ''}</span>
            <Button variant="bubble" className="px-2.5 py-0.5" onClick={() => setReplying(true)}>
              Reply
            </Button>
          </div>
        )}
      </ScrollArea>
    </SpeechBubble>
  );
}
