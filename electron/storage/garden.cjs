const emptyGarden = () => ({ dates: [], notes: '', messages: [], people: [] });

const withIds = (list) => (Array.isArray(list) ? list.filter((item) => item && typeof item.id === 'string') : []);

function normalizeGarden(raw) {
  return {
    dates: withIds(raw?.dates),
    notes: typeof raw?.notes === 'string' ? raw.notes : '',
    messages: withIds(raw?.messages),
    people: withIds(raw?.people),
  };
}

function upsertById(list, item) {
  const index = list.findIndex((existing) => existing.id === item.id);
  if (index === -1) return [...list, item];
  return list.map((existing, i) => (i === index ? item : existing));
}

const removeById = (list, id) => list.filter((item) => item.id !== id);

const serialize = (garden) => JSON.stringify(garden);

function createEmitter() {
  const listeners = new Set();
  let last = null;
  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    remember(garden) {
      last = serialize(garden);
    },
    emitIfChanged(garden) {
      const next = serialize(garden);
      if (next === last) return;
      last = next;
      listeners.forEach((listener) => listener(garden));
    },
  };
}

module.exports = { emptyGarden, normalizeGarden, upsertById, removeById, createEmitter };
