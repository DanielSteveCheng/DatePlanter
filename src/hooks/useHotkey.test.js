import { expect, it } from 'vitest';
import { matchesHotkey } from './useHotkey';

const combo = { key: 'd', ctrl: true, shift: true };

it('matches only the exact modifier combination', () => {
  expect(matchesHotkey({ key: 'D', ctrlKey: true, shiftKey: true }, combo)).toBe(true);
  expect(matchesHotkey({ key: 'D', metaKey: true, shiftKey: true }, combo)).toBe(true);
  expect(matchesHotkey({ key: 'd', ctrlKey: true, shiftKey: false }, combo)).toBe(false);
  expect(matchesHotkey({ key: 'x', ctrlKey: true, shiftKey: true }, combo)).toBe(false);
});
