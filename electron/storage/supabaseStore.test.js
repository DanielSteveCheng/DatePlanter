import { describe, expect, it, vi } from 'vitest';
import { createSupabaseStore, supabaseError } from './supabaseStore.cjs';

function fakeResponse(body, { ok = true, status = 200 } = {}) {
  return { ok, status, text: async () => (body === undefined ? '' : JSON.stringify(body)) };
}

function fakeSupabase() {
  const db = { dates: [], notes: '', messages: [] };
  const fetchImpl = vi.fn(async (url, init) => {
    const { pathname, searchParams } = new URL(url);
    const table = pathname.split('/').pop();
    if (init.method === 'GET') {
      if (table === 'messages') return fakeResponse(db.messages.map((data) => ({ data })));
      return fakeResponse(table === 'dates' ? db.dates.map((data) => ({ data })) : db.notes ? [{ value: db.notes }] : []);
    }
    if (init.method === 'DELETE') {
      const id = searchParams.get('id').replace('eq.', '');
      db.dates = db.dates.filter((d) => d.id !== id);
      return fakeResponse(undefined, { status: 204 });
    }
    const row = JSON.parse(init.body);
    if (table === 'shared') db.notes = row.value;
    else db[table] = [...db[table].filter((d) => d.id !== row.id), row.data];
    return fakeResponse(undefined, { status: 201 });
  });
  return { db, fetchImpl };
}

describe('supabaseStore', () => {
  it('round-trips dates and notes through the REST api', async () => {
    const { fetchImpl } = fakeSupabase();
    const store = createSupabaseStore({ url: 'https://x.supabase.co/', key: 'a.b.c' }, { fetchImpl });

    await store.upsertDate({ id: 'a', title: 'Picnic' });
    const garden = await store.saveNotes('bring snacks');
    expect(garden).toEqual({ dates: [{ id: 'a', title: 'Picnic' }], notes: 'bring snacks', messages: [] });
    expect((await store.upsertMessage({ id: 'm', text: 'hi' })).messages).toEqual([{ id: 'm', text: 'hi' }]);
    expect((await store.deleteDate('a')).dates).toEqual([]);

    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('https://x.supabase.co/rest/v1/dates');
    expect(init.headers).toMatchObject({ apikey: 'a.b.c', Authorization: 'Bearer a.b.c' });
    store.dispose();
  });

  it('sends publishable keys only as the apikey header', async () => {
    const { fetchImpl } = fakeSupabase();
    const store = createSupabaseStore({ url: 'https://x.supabase.co', key: 'sb_publishable_abc' }, { fetchImpl });
    await store.load();
    expect(fetchImpl.mock.calls[0][1].headers).toEqual({ apikey: 'sb_publishable_abc', 'Content-Type': 'application/json' });
    store.dispose();
  });

  it('keeps working when the messages table has not been created yet', async () => {
    const { fetchImpl } = fakeSupabase();
    const missingMessages = vi.fn(async (url, init) =>
      url.includes('/messages') ? { ok: false, status: 404, text: async () => 'relation does not exist' } : fetchImpl(url, init),
    );
    const store = createSupabaseStore({ url: 'https://x.supabase.co', key: 'k' }, { fetchImpl: missingMessages });
    expect((await store.load()).messages).toEqual([]);
    store.dispose();
  });

  it('surfaces api errors', async () => {
    const fetchImpl = vi.fn(async () => ({ ok: false, status: 401, text: async () => 'bad key' }));
    const store = createSupabaseStore({ url: 'https://x.supabase.co', key: 'k' }, { fetchImpl });
    await expect(store.load()).rejects.toThrow('Supabase 401: bad key');
    store.dispose();
  });
});

describe('supabaseError', () => {
  it('turns a missing table into an instruction', () => {
    const body = JSON.stringify({ code: 'PGRST205', message: "Could not find the table 'public.messages' in the schema cache" });
    expect(supabaseError(404, body).message).toBe(
      'Your Supabase project is missing the "messages" table. Run docs/supabase.sql in the Supabase SQL editor.',
    );
  });

  it('keeps just the readable message for other errors', () => {
    expect(supabaseError(401, JSON.stringify({ code: 'x', message: 'Invalid API key' })).message).toBe('Supabase 401: Invalid API key');
    expect(supabaseError(500, 'oops').message).toBe('Supabase 500: oops');
  });
});
