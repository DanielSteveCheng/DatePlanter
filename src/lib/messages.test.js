import { describe, expect, it } from 'vitest';
import { MESSAGE_MAX_LENGTH, createMessage, markRead, senderName, sentBy, unreadFor, validateMessage } from './messages';

const me = { deviceId: 'me', name: 'Dan' };
const them = { deviceId: 'them', name: 'Sam' };
const at = (iso) => new Date(iso);

describe('validateMessage', () => {
  it('needs some text and not too much', () => {
    expect(validateMessage('   ')).toBeTruthy();
    expect(validateMessage('x'.repeat(MESSAGE_MAX_LENGTH + 1))).toBeTruthy();
    expect(validateMessage(' Dinner Friday? ')).toBeNull();
  });
});

describe('inbox', () => {
  const messages = [
    createMessage('second', { from: them, now: at('2026-09-25T10:00:00Z'), id: 'b' }),
    createMessage('first', { from: them, now: at('2026-09-25T09:00:00Z'), id: 'a' }),
    createMessage('mine', { from: me, now: at('2026-09-25T09:30:00Z'), id: 'm' }),
    markRead(createMessage('old', { from: them, now: at('2026-09-24T09:00:00Z'), id: 'r' }), at('2026-09-24T10:00:00Z')),
  ];

  it('shows unread messages from the other person, oldest first', () => {
    expect(unreadFor(messages, 'me').map((m) => m.id)).toEqual(['a', 'b']);
    expect(unreadFor(messages, 'them').map((m) => m.id)).toEqual(['m']);
  });

  it('lists what I sent, newest first', () => {
    expect(sentBy(messages, 'them').map((m) => m.id)).toEqual(['b', 'a', 'r']);
  });

  it('trims text, stamps times, and names anonymous senders', () => {
    const message = createMessage('  hi  ', { from: { deviceId: 'x', name: '' }, now: at('2026-09-25T09:00:00Z'), id: 'z' });
    expect(message).toEqual({ id: 'z', text: 'hi', from: { deviceId: 'x', name: '' }, createdAt: '2026-09-25T09:00:00.000Z', readAt: null });
    expect(senderName(message)).toBe('Someone');
    expect(senderName(messages[0])).toBe('Sam');
  });
});

describe('replies', () => {
  const original = createMessage('Dinner Friday at 7?', { from: me, now: at('2026-09-25T09:00:00Z'), id: 'o' });

  it('keeps a snapshot of the message being replied to', () => {
    const reply = createMessage('Yes!', { from: them, replyTo: original, now: at('2026-09-25T09:05:00Z'), id: 'r' });
    expect(reply.replyTo).toEqual({ id: 'o', text: 'Dinner Friday at 7?', name: 'Dan' });
  });

  it('leaves ordinary messages without reply context', () => {
    expect(createMessage('Hi', { from: me, id: 'x' })).not.toHaveProperty('replyTo');
  });
});
