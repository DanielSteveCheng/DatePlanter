const PREFIX = 'DP1.';

const toBase64Url = (text) => btoa(text).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
const fromBase64Url = (code) => atob(code.replaceAll('-', '+').replaceAll('_', '/'));

export const canInvite = (storage) => storage?.type === 'supabase' && Boolean(storage.supabaseUrl && storage.supabaseKey);

export function encodeInvite(storage) {
  if (!canInvite(storage)) throw new Error('Connect to Supabase first to make an invite code.');
  return PREFIX + toBase64Url(JSON.stringify({ u: storage.supabaseUrl.trim(), k: storage.supabaseKey.trim() }));
}

export function decodeInvite(code) {
  const trimmed = code.replace(/\s+/g, '');
  if (!trimmed.startsWith(PREFIX)) throw new Error("That doesn't look like a Date Planter invite code.");
  let parsed;
  try {
    parsed = JSON.parse(fromBase64Url(trimmed.slice(PREFIX.length)));
  } catch {
    throw new Error('That invite code seems to be cut off. Try copying it again.');
  }
  if (typeof parsed?.u !== 'string' || !/^https:\/\//.test(parsed.u) || typeof parsed.k !== 'string' || !parsed.k) {
    throw new Error('That invite code is missing the garden details.');
  }
  return { type: 'supabase', supabaseUrl: parsed.u, supabaseKey: parsed.k };
}
