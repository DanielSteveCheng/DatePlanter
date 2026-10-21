import { useMemo } from 'react';
import { isDevRecord } from '../lib/devFixtures';
import { conversationFor, createMessage, markRead, unreadFor } from '../lib/messages';

const NO_PARTNER = "Your partner hasn't set up their plant yet.";

export function useInbox({ garden, dev, identity, settings }) {
  const { me, partner } = identity;
  const messages = garden.messages;

  const all = useMemo(() => [...messages, ...dev.messages], [messages, dev.messages]);
  const unread = useMemo(() => unreadFor(all, me), [all, me]);
  const conversation = useMemo(() => conversationFor(all, me), [all, me]);

  async function send(text, replyTo) {
    const to = replyTo?.from?.personId ?? partner?.id;
    if (!me || !to) throw new Error(NO_PARTNER);
    const from = { personId: me.id, deviceId: settings.deviceId, name: me.name };
    return garden.saveMessage(createMessage(text, { from, to, replyTo }));
  }

  return {
    unread,
    conversation,
    me,
    recipient: partner,
    send,
    dismiss: (message) => (isDevRecord(message) ? dev.saveMessage(markRead(message)) : garden.saveMessage(markRead(message))),
    remove: (message) => (isDevRecord(message) ? dev.deleteMessage(message.id) : garden.deleteMessage(message.id)),
  };
}
