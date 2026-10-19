export const MESSAGE_MAX_LENGTH = 500;

export const senderName = (message) => message.from?.name?.trim() || 'Someone';

export function validateMessage(text) {
  const trimmed = text.trim();
  if (!trimmed) return 'Write something sweet first';
  if (trimmed.length > MESSAGE_MAX_LENGTH) return `Keep it under ${MESSAGE_MAX_LENGTH} characters`;
  return null;
}

const replyContext = (original) => ({ id: original.id, text: original.text, name: senderName(original) });

export function createMessage(text, { from, replyTo = null, now = new Date(), id = crypto.randomUUID() }) {
  const message = { id, text: text.trim(), from, createdAt: now.toISOString(), readAt: null };
  return replyTo ? { ...message, replyTo: replyContext(replyTo) } : message;
}

export const markRead = (message, now = new Date()) => ({ ...message, readAt: now.toISOString() });

const byOldest = (a, b) => a.createdAt.localeCompare(b.createdAt);

export const unreadFor = (messages, deviceId) =>
  messages.filter((message) => message.from?.deviceId !== deviceId && !message.readAt).sort(byOldest);

export const sentBy = (messages, deviceId) =>
  messages.filter((message) => message.from?.deviceId === deviceId).sort(byOldest).reverse();

