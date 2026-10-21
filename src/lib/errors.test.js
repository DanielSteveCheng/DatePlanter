import { expect, it } from 'vitest';
import { readableError } from './errors';

it('strips the Electron IPC wrapper from error messages', () => {
  const error = new Error("Error invoking remote method 'garden:upsertMessage': Error: Your Supabase project is missing a table.");
  expect(readableError(error)).toBe('Your Supabase project is missing a table.');
  expect(readableError(new Error('plain'))).toBe('plain');
  expect(readableError('text')).toBe('text');
});
