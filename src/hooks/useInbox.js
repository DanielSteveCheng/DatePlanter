import { useMemo } from 'react';
import { isDevRecord } from '../lib/devFixtures';
import { createMessage, markRead, sentBy, unreadFor } from '../lib/messages';

export function useInbox({ garden, dev, settings }) {
  const deviceId = settings?.deviceId;
  const messages = garden.messages;

  const unread = useMemo(() => unreadFor([...messages, ...dev.messages], deviceId), [messages, dev.messages, deviceId]);
  const sent = useMemo(() => sentBy(messages, deviceId), [messages, deviceId]);

  return {
    unread,
    sent,
    send: (text, replyTo) => garden.saveMessage(createMessage(text, { from: { deviceId, name: settings.author }, replyTo })),
    dismiss: (message) => (isDevRecord(message) ? dev.saveMessage(markRead(message)) : garden.saveMessage(markRead(message))),
  };
}
