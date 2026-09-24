import { expect, it } from 'vitest';
import { shouldStayOnTop } from './onTop.cjs';

it('keeps the window on top according to the mode and pot state', () => {
  expect(shouldStayOnTop('pot', true)).toBe(true);
  expect(shouldStayOnTop('pot', false)).toBe(false);
  expect(shouldStayOnTop('always', false)).toBe(true);
  expect(shouldStayOnTop('never', true)).toBe(false);
  expect(shouldStayOnTop(undefined, true)).toBe(true);
});
