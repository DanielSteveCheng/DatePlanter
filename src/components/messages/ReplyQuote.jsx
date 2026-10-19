import { useState } from 'react';
import { cn } from '../../lib/cn';

const TONES = {
  bubble: 'border-bubble-ink/30 bg-black/5 hover:bg-black/10',
  card: 'border-card-accent/60 bg-black/15 hover:bg-black/25',
};

export function ReplyQuote({ replyTo, label, tone = 'bubble' }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <button
      type="button"
      data-slot="message-quote"
      aria-expanded={expanded}
      title={expanded ? 'Show less' : 'Show the whole message'}
      onClick={() => setExpanded((current) => !current)}
      className={cn('mt-1.5 block w-full rounded-md border-l-2 px-2 py-1 text-left', TONES[tone])}
    >
      <span className="block text-label font-semibold opacity-70">{label}</span>
      <span className={cn('block break-words text-label', expanded ? 'whitespace-pre-wrap' : 'truncate')}>{replyTo.text}</span>
    </button>
  );
}
