import { expect, it } from 'vitest';
import { LOADING_MESSAGES, pickLoadingMessage } from './loadingMessages';

it('picks a message from the list across the whole random range', () => {
  expect(pickLoadingMessage(() => 0)).toBe(LOADING_MESSAGES[0]);
  expect(pickLoadingMessage(() => 0.999999)).toBe(LOADING_MESSAGES.at(-1));
  expect(LOADING_MESSAGES).toContain(pickLoadingMessage());
});
