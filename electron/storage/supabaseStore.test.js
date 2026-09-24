import { describe, expect, it, vi } from 'vitest';
import { createSupabaseStore } from './supabaseStore.cjs';

function fakeResponse(body, { ok = true, status = 200 } = {}) {
  return { ok, status, text: async () => (body === undefined ? '' : JSON.stringify(body)) };
}

function fakeSupabase() {
  const db = { dates: [], notes: '' };
  const fetchImpl = vi.fn(async (url, init) => {
    const { pathname, searchParams } = new URL(url);
    const table = pathname.split('/').pop();
    if (init.method === 'GET') {
      return fakeResponse(table === 'dates' ? db.dates.map((data) => ({ data })) : db.notes ? [{ value: db.notes }] : []);
    }
    if (init.method === 'DELETE') {
      const id = searchParams.get('id').replace('eq.', '');
      db.dates = db.dates.filter((d) => d.id !== id);
      return fakeResponse(undefined, { status: 204 });
    }
    const row = JSON.parse(init.body);
    if (table === 'shared') db.notes = row.value;
    else db.dates = [...db.dates.filter((d) => d.id !== row.id), row.data];
    return fakeResponse(undefined, { status: 201 });
  });
  return { db, fetchImpl };
}

describe('supabaseStore', () => {
  it('round-trips dates and notes through the REST api', async () => {
    const { fetchImpl } = fakeSupabase();
    const store = createSupabaseStore({ url: 'https://x.supabase.co/', key: 'k' }, { fetchImpl });

    await store.upsertDate({ id: 'a', title: 'Picnic' });
    const garden = await store.saveNotes('bring snacks');
    expect(garden).toEqual({ dates: [{ id: 'a', title: 'Picnic' }], notes: 'bring snacks' });
    expect((await store.deleteDate('a')).dates).toEqual([]);

    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('https://x.supabase.co/rest/v1/dates');
    expect(init.headers).toMatchObject({ apikey: 'k', Authorization: 'Bearer k' });
    store.dispose();
  });

  it('surfaces api errors', async () => {
    const fetchImpl = vi.fn(async () => ({ ok: false, status: 401, text: async () => 'bad key' }));
    const store = createSupabaseStore({ url: 'https://x.supabase.co', key: 'k' }, { fetchImpl });
    await expect(store.load()).rejects.toThrow('Supabase 401: bad key');
    store.dispose();
  });
});
