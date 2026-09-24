import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createFileStore } from './fileStore.cjs';

describe('fileStore', () => {
  let dir;
  let filePath;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'date-planter-'));
    filePath = path.join(dir, 'nested', 'garden.json');
  });

  afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

  it('starts empty when the file does not exist', async () => {
    const store = createFileStore(filePath, { watch: false });
    expect(await store.load()).toEqual({ dates: [], notes: '' });
  });

  it('persists dates and notes to disk', async () => {
    const store = createFileStore(filePath, { watch: false });
    await store.upsertDate({ id: 'a', title: 'Picnic' });
    await store.saveNotes('bring blanket');
    const garden = await store.upsertDate({ id: 'a', title: 'Beach picnic' });

    expect(garden.dates).toEqual([{ id: 'a', title: 'Beach picnic' }]);
    expect(JSON.parse(fs.readFileSync(filePath, 'utf8'))).toEqual(garden);
    expect((await store.deleteDate('a')).dates).toEqual([]);
  });

  it('merges with changes another computer wrote to the file', async () => {
    const store = createFileStore(filePath, { watch: false });
    await store.upsertDate({ id: 'mine' });
    const theirs = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    theirs.dates.push({ id: 'theirs' });
    fs.writeFileSync(filePath, JSON.stringify(theirs));

    const garden = await store.saveNotes('hi');
    expect(garden.dates.map((d) => d.id)).toEqual(['mine', 'theirs']);
  });

  it('notifies subscribers of external edits', async () => {
    const store = createFileStore(filePath, { pollMs: 20 });
    await store.upsertDate({ id: 'a' });
    const changed = new Promise((resolve) => store.subscribe(resolve));
    fs.writeFileSync(filePath, JSON.stringify({ dates: [{ id: 'a' }, { id: 'b' }], notes: '' }));

    expect((await changed).dates).toHaveLength(2);
    store.dispose();
  });
});
