const { normalizeGarden, createEmitter } = require('./garden.cjs');

const NOTES_KEY = 'notes';

function createSupabaseStore({ url, key }, { fetchImpl = fetch, pollMs = 10000 } = {}) {
  const baseUrl = `${url.replace(/\/+$/, '')}/rest/v1`;
  const emitter = createEmitter();
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  };

  async function request(pathname, { method = 'GET', body, prefer } = {}) {
    const response = await fetchImpl(`${baseUrl}${pathname}`, {
      method,
      headers: prefer ? { ...headers, Prefer: prefer } : headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await response.text();
    if (!response.ok) throw new Error(`Supabase ${response.status}: ${text}`);
    return text ? JSON.parse(text) : null;
  }

  const upsert = (table, row) =>
    request(`/${table}`, { method: 'POST', body: row, prefer: 'resolution=merge-duplicates,return=minimal' });

  async function load() {
    const [dateRows, noteRows] = await Promise.all([
      request('/dates?select=data'),
      request(`/shared?select=value&key=eq.${NOTES_KEY}`),
    ]);
    const garden = normalizeGarden({ dates: dateRows.map((row) => row.data), notes: noteRows[0]?.value ?? '' });
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
    upsertDate: (date) => mutateThenLoad(() => upsert('dates', { id: date.id, data: date, updated_at: new Date().toISOString() })),
    deleteDate: (id) => mutateThenLoad(() => request(`/dates?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' })),
    saveNotes: (notes) => mutateThenLoad(() => upsert('shared', { key: NOTES_KEY, value: notes })),
    subscribe: emitter.subscribe,
    dispose: () => clearInterval(timer),
  };
}

module.exports = { createSupabaseStore };
