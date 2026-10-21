export const MESSAGE_MAX_LENGTH = 500;

export const senderName = (message) => message.from?.name?.trim() || 'Someone';

export function validateMessage(text) {
  const trimmed = text.trim();
  if (!trimmed) return 'Write something sweet first';
  if (trimmed.length > MESSAGE_MAX_LENGTH) return `Keep it under ${MESSAGE_MAX_LENGTH} characters`;
  return null;
}

const replyContext = (original) => ({ id: original.id, text: original.text, name: senderName(original) });

export function createMessage(text, { from, to = null, replyTo = null, now = new Date(), id = crypto.randomUUID() }) {
  const message = { id, text: text.trim(), from, to, createdAt: now.toISOString(), readAt: null };
  return replyTo ? { ...message, replyTo: replyContext(replyTo) } : message;
}

export const markRead = (message, now = new Date()) => ({ ...message, readAt: now.toISOString() });

const byOldest = (a, b) => a.createdAt.localeCompare(b.createdAt);

export const isFromPerson = (message, person) =>
  Boolean(person) && (message.from?.personId === person.id || Boolean(person.deviceIds?.includes(message.from?.deviceId)));

// Messages from before people existed have no `to`: they're for whoever didn't send them.
const isFor = (message, person) => (message.to ? message.to === person.id : !isFromPerson(message, person));

export const unreadFor = (messages, person) =>
  person ? messages.filter((message) => !message.readAt && isFor(message, person)).sort(byOldest) : [];

export const sentBy = (messages, person) =>
  person ? messages.filter((message) => isFromPerson(message, person)).sort(byOldest).reverse() : [];

export const conversationFor = (messages, person) =>
  person
    ? messages.filter((message) => isFromPerson(message, person) || isFor(message, person)).sort(byOldest).reverse()
    : [];

