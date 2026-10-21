import { useState } from 'react';
import { Sprite } from '../../sprites/Sprite';
import { SPRITE_SIZES, spriteSize } from '../../sprites/sizes';
import { senderName } from '../../lib/messages';
import { placeBubble } from '../../lib/bubble';
import { useElementHeight } from '../../hooks/useElementHeight';
import { MessageBubble } from './MessageBubble';

export function MessageSprout({ inbox, placement = 'above', room, style }) {
  const [open, setOpen] = useState(false);
  const [bubbleRef, bubbleHeight] = useElementHeight();
  const { unread } = inbox;
  const message = unread[0];
  if (!message) return null;

  const bubble = placeBubble({ placement, room, bubbleHeight, bud: SPRITE_SIZES['message-bud'] });

  function close() {
    setOpen(false);
    inbox.dismiss(message);
  }

  async function reply(text) {
    await inbox.send(text, message);
    close();
  }

  return (
    <div data-slot="message-sprout" className="absolute z-10" style={style}>
      <button
        type="button"
        aria-label={`Message from ${senderName(message)}`}
        title="You have a message!"
        onClick={() => setOpen((current) => !current)}
        className="absolute bottom-0 left-0 block -translate-x-1/2 animate-sprout"
      >
        <Sprite slot="message-bud" className="block origin-bottom animate-sway hover:brightness-110" style={spriteSize('message-bud')} />
        {unread.length > 1 && (
          <span className="absolute -right-2 -top-1 min-w-4 rounded-full bg-card px-1 text-center text-label font-bold text-card-text">
            {unread.length}
          </span>
        )}
      </button>
      {open && (
        <div ref={bubbleRef} className="absolute" style={bubble.style}>
          <MessageBubble
            message={message}
            waiting={unread.length - 1}
            tail={bubble.tail}
            tailTop={bubble.tailTop}
            maxHeight={bubble.maxHeight}
            onClose={close}
            onReply={reply}
          />
        </div>
      )}
    </div>
  );
}
