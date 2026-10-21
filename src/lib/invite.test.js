import { describe, expect, it } from 'vitest';
import { canInvite, decodeInvite, encodeInvite } from './invite';

const storage = {
  type: 'supabase',
  filePath: '',
  supabaseUrl: 'https://abcd.supabase.co',
  supabaseKey: 'sb_publishable_abc123',
};

describe('invite codes', () => {
  it('round-trips the Supabase details through one short code', () => {
    const code = encodeInvite(storage);
    expect(code.startsWith('DP1.')).toBe(true);
    expect(decodeInvite(code)).toEqual({ type: 'supabase', supabaseUrl: storage.supabaseUrl, supabaseKey: storage.supabaseKey });
  });

  it('tolerates spaces and line breaks picked up when pasting', () => {
    const code = encodeInvite(storage);
    expect(decodeInvite(`  ${code.slice(0, 10)}\n${code.slice(10)} `).supabaseKey).toBe(storage.supabaseKey);
  });

  it('only makes codes for a connected Supabase garden', () => {
    expect(canInvite(storage)).toBe(true);
    expect(canInvite({ type: 'file', filePath: 'C:/x.json' })).toBe(false);
    expect(() => encodeInvite({ type: 'supabase', supabaseUrl: '', supabaseKey: '' })).toThrow();
  });

  it('explains what is wrong with a bad code', () => {
    expect(() => decodeInvite('hello')).toThrow(/doesn't look like/);
    expect(() => decodeInvite('DP1.%%%')).toThrow(/cut off/);
    expect(() => decodeInvite(`DP1.${btoa(JSON.stringify({ u: 'http://x', k: 'k' }))}`)).toThrow(/missing/);
  });
});
