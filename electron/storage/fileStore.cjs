const fs = require('node:fs');
const path = require('node:path');
const { emptyGarden, normalizeGarden, upsertById, removeById, createEmitter } = require('./garden.cjs');

function createFileStore(filePath, { pollMs = 2000, watch = true } = {}) {
  const emitter = createEmitter();

  async function read() {
    try {
      return normalizeGarden(JSON.parse(await fs.promises.readFile(filePath, 'utf8')));
    } catch (error) {
      if (error.code === 'ENOENT') return emptyGarden();
      throw error;
    }
  }

  async function write(garden) {
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    const tempPath = `${filePath}.${process.pid}.tmp`;
    await fs.promises.writeFile(tempPath, JSON.stringify(garden, null, 2));
    await fs.promises.rename(tempPath, filePath);
    emitter.remember(garden);
  }

  async function mutate(change) {
    const next = change(await read());
    await write(next);
    return next;
  }

  async function onFileChanged() {
    try {
      emitter.emitIfChanged(await read());
    } catch {
      // A sync client may be mid-write; the next poll will pick it up.
    }
  }

  if (watch) fs.watchFile(filePath, { interval: pollMs }, onFileChanged);

  return {
    async load() {
      const garden = await read();
      emitter.remember(garden);
      return garden;
    },
    upsertDate: (date) => mutate((g) => ({ ...g, dates: upsertById(g.dates, date) })),
    deleteDate: (id) => mutate((g) => ({ ...g, dates: removeById(g.dates, id) })),
    saveNotes: (notes) => mutate((g) => ({ ...g, notes })),
    subscribe: emitter.subscribe,
    dispose: () => watch && fs.unwatchFile(filePath, onFileChanged),
  };
}

module.exports = { createFileStore };
