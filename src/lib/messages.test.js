import { describe, expect, it } from 'vitest';
import {
  MESSAGE_MAX_LENGTH,
  conversationFor,
  createMessage,
  isFromPerson,
  markRead,
  senderName,
  sentBy,
  unreadFor,
  validateMessage,
} from './messages';

const dan = { id: 'dan', name: 'Dan', deviceIds: ['desktop', 'laptop'] };
const sam = { id: 'sam', name: 'Sam', deviceIds: ['mac'] };
const fromDan = { personId: 'dan', deviceId: 'desktop', name: 'Dan' };
const fromSam = { personId: 'sam', deviceId: 'mac', name: 'Sam' };
const at = (iso) => new Date(iso);

describe('validateMessage', () => {
  it('needs some text and not too much', () => {
    expect(validateMessage('   ')).toBeTruthy();
    expect(validateMessage('x'.repeat(MESSAGE_MAX_LENGTH + 1))).toBeTruthy();
    expect(validateMessage(' Dinner Friday? ')).toBeNull();
  });
});

describe('routing between two people', () => {
  const messages = [
    createMessage('second', { from: fromSam, to: 'dan', now: at('2026-10-21T10:00:00Z'), id: 'b' }),
    createMessage('first', { from: fromSam, to: 'dan', now: at('2026-10-21T09:00:00Z'), id: 'a' }),
    createMessage('mine', { from: fromDan, to: 'sam', now: at('2026-10-21T09:30:00Z'), id: 'm' }),
    markRead(createMessage('old', { from: fromSam, to: 'dan', now: at('2026-10-20T09:00:00Z'), id: 'r' }), at('2026-10-20T10:00:00Z')),
  ];

  it('delivers unread messages addressed to me, oldest first', () => {
    expect(unreadFor(messages, dan).map((m) => m.id)).toEqual(['a', 'b']);
    expect(unreadFor(messages, sam).map((m) => m.id)).toEqual(['m']);
  });

  it('never delivers my own messages to my other computers', () => {
    const fromLaptop = createMessage('from my laptop', { from: { personId: 'dan', deviceId: 'laptop', name: 'Dan' }, to: 'sam', id: 'l' });
    expect(unreadFor([fromLaptop], dan)).toEqual([]);
    expect(unreadFor([fromLaptop], sam).map((m) => m.id)).toEqual(['l']);
  });

  it('lists what I sent from any of my computers, newest first', () => {
    expect(sentBy(messages, sam).map((m) => m.id)).toEqual(['b', 'a', 'r']);
  });

  it('lists both directions of the conversation, newest first, read or not', () => {
    expect(conversationFor(messages, dan).map((m) => m.id)).toEqual(['b', 'm', 'a', 'r']);
    expect(conversationFor(messages, null)).toEqual([]);
  });

  it('shows nothing until this computer knows who it belongs to', () => {
    expect(unreadFor(messages, null)).toEqual([]);
    expect(sentBy(messages, null)).toEqual([]);
  });
});

describe('messages from before people existed', () => {
  const legacy = { id: 'x', text: 'hi', from: { deviceId: 'desktop', name: 'Dan' }, createdAt: '2026-09-25T00:00:00Z', readAt: null };

  it('recognises the sender by their computer', () => {
    expect(isFromPerson(legacy, dan)).toBe(true);
    expect(unreadFor([legacy], dan)).toEqual([]);
    expect(unreadFor([legacy], sam).map((m) => m.id)).toEqual(['x']);
  });
});

describe('createMessage', () => {
  it('trims text, addresses it, and names anonymous senders', () => {
    const message = createMessage('  hi  ', { from: { deviceId: 'x', name: '' }, to: 'sam', now: at('2026-10-21T09:00:00Z'), id: 'z' });
    expect(message).toEqual({ id: 'z', text: 'hi', from: { deviceId: 'x', name: '' }, to: 'sam', createdAt: '2026-10-21T09:00:00.000Z', readAt: null });
    expect(senderName(message)).toBe('Someone');
    expect(senderName({ from: fromSam })).toBe('Sam');
  });

  it('keeps a snapshot of the message being replied to', () => {
    const original = createMessage('Dinner Friday at 7?', { from: fromDan, to: 'sam', id: 'o' });
    const reply = createMessage('Yes!', { from: fromSam, to: 'dan', replyTo: original, id: 'r' });
    expect(reply.replyTo).toEqual({ id: 'o', text: 'Dinner Friday at 7?', name: 'Dan' });
    expect(createMessage('Hi', { from: fromDan, id: 'x' })).not.toHaveProperty('replyTo');
  });
});
