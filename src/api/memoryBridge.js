import { removeById, upsertById } from '../lib/list';

export function createMemoryBridge(initialGarden = { dates: [], notes: '' }) {
  let garden = initialGarden;
  let settings = {
    author: '',
    units: 'fahrenheit',
    location: null,
    weatherPreview: 'live',
    devMode: false,
    keepOnTop: 'pot',
    storage: { type: 'file', filePath: '', supabaseUrl: '', supabaseKey: '' },
  };
  const commit = (next) => Promise.resolve((garden = next));
  const noop = () => Promise.resolve();

  return {
    garden: {
      load: () => Promise.resolve(garden),
      upsertDate: (date) => commit({ ...garden, dates: upsertById(garden.dates, date) }),
      deleteDate: (id) => commit({ ...garden, dates: removeById(garden.dates, id) }),
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
    window: {
      collapse: noop,
      expand: noop,
      setPotHover: noop,
      onPotMoved: () => () => {},
      beginDrag: noop,
      endDrag: noop,
      close: noop,
      beginResize: noop,
      endResize: noop,
    },
  };
}
