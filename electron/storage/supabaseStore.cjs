const { normalizeGarden, createEmitter } = require('./garden.cjs');

const NOTES_KEY = 'notes';

const isLegacyJwtKey = (key) => key.split('.').length === 3;

function authHeaders(key) {
  return isLegacyJwtKey(key) ? { apikey: key, Authorization: `Bearer ${key}` } : { apikey: key };
}

function supabaseError(status, body) {
  let details = null;
  try {
    details = JSON.parse(body);
  } catch {
    return new Error(`Supabase ${status}: ${body}`);
  }
  if (details?.code === 'PGRST205') {
    const table = /'(?:public\.)?([\w]+)'/.exec(details.message ?? '')?.[1] ?? 'a';
    return new Error(`Your Supabase project is missing the "${table}" table. Run docs/supabase.sql in the Supabase SQL editor.`);
  }
  return new Error(`Supabase ${status}: ${details?.message ?? body}`);
}

function createSupabaseStore({ url, key }, { fetchImpl = fetch, pollMs = 10000 } = {}) {
  const baseUrl = `${url.replace(/\/+$/, '')}/rest/v1`;
  const emitter = createEmitter();
  const headers = { ...authHeaders(key), 'Content-Type': 'application/json' };

  async function request(pathname, { method = 'GET', body, prefer } = {}) {
    const response = await fetchImpl(`${baseUrl}${pathname}`, {
      method,
      headers: prefer ? { ...headers, Prefer: prefer } : headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await response.text();
    if (!response.ok) throw supabaseError(response.status, text);
    return text ? JSON.parse(text) : null;
  }

  const upsert = (table, row) =>
    request(`/${table}`, { method: 'POST', body: row, prefer: 'resolution=merge-duplicates,return=minimal' });

  const upsertRecord = (table, record) => upsert(table, { id: record.id, data: record, updated_at: new Date().toISOString() });

  async function load() {
    const [dateRows, noteRows, messageRows] = await Promise.all([
      request('/dates?select=data'),
      request(`/shared?select=value&key=eq.${NOTES_KEY}`),
      request('/messages?select=data').catch(() => []),
    ]);
    const garden = normalizeGarden({
      dates: dateRows.map((row) => row.data),
      notes: noteRows[0]?.value ?? '',
      messages: messageRows.map((row) => row.data),
    });
    emitter.remember(garden);
    return garden;
  }

  async function mutateThenLoad(action) {
    await action();
    return load();
  }

  const timer = setInterval(() => load().then(emitter.emitIfChanged, () => {}), pollMs);
  timer.unref?.();

  return {
    load,
    upsertDate: (date) => mutateThenLoad(() => upsertRecord('dates', date)),
    deleteDate: (id) => mutateThenLoad(() => request(`/dates?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' })),
    saveNotes: (notes) => mutateThenLoad(() => upsert('shared', { key: NOTES_KEY, value: notes })),
    upsertMessage: (message) => mutateThenLoad(() => upsertRecord('messages', message)),
    subscribe: emitter.subscribe,
    dispose: () => clearInterval(timer),
  };
}

module.exports = { createSupabaseStore, supabaseError };
