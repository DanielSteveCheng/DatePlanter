import { useState } from 'react';
import { validateMessage } from '../../lib/messages';
import { readableError } from '../../lib/errors';

export function useMessageDraft(onSend) {
  const [text, setText] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle');

  async function send() {
    const problem = validateMessage(text);
    setError(problem);
    if (problem) return;
    setStatus('sending');
    try {
      await onSend(text);
      setText('');
      setStatus('sent');
    } catch (sendError) {
      setError(`Couldn't send: ${readableError(sendError)}`);
      setStatus('idle');
    }
  }

  return {
    text,
    edit: (next) => {
      setText(next);
      setStatus('idle');
    },
    error,
    sending: status === 'sending',
    sent: status === 'sent',
    send,
  };
}
