const upsertById = (list, item) =>
  list.some((existing) => existing.id === item.id)
    ? list.map((existing) => (existing.id === item.id ? item : existing))
    : [...list, item];

export function createMemoryBridge(initialGarden = { dates: [], notes: '' }) {
  let garden = initialGarden;
  let settings = {
    author: '',
    units: 'fahrenheit',
    location: null,
    weatherPreview: 'live',
    storage: { type: 'file', filePath: '', supabaseUrl: '', supabaseKey: '' },
  };
  const commit = (next) => Promise.resolve((garden = next));
  const noop = () => Promise.resolve();

  return {
    garden: {
      load: () => Promise.resolve(garden),
      upsertDate: (date) => commit({ ...garden, dates: upsertById(garden.dates, date) }),
      deleteDate: (id) => commit({ ...garden, dates: garden.dates.filter((d) => d.id !== id) }),
      saveNotes: (notes) => commit({ ...garden, notes }),
      onChange: () => () => {},
      onError: () => () => {},
    },
    settings: {
      get: () => Promise.resolve(settings),
      update: (patch) => {
        settings = { ...settings, ...patch, storage: { ...settings.storage, ...(patch.storage ?? {}) } };
        return Promise.resolve(settings);
      },
      chooseFolder: () => Promise.resolve(null),
    },
    window: { minimize: noop, toggleMaximize: noop, close: noop },
  };
}
