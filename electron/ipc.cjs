const path = require('node:path');
const { ipcMain, dialog } = require('electron');
const { createStore, storageKey } = require('./storage/index.cjs');

const SHARED_FILE_NAME = 'date-planter.json';

function registerIpc({ win, settings, defaultDataPath }) {
  let store = null;
  let unsubscribe = () => {};

  const send = (channel, payload) => {
    if (!win.isDestroyed()) win.webContents.send(channel, payload);
  };

  function connect() {
    unsubscribe();
    store?.dispose();
    store = createStore(settings.get().storage, { defaultFilePath: defaultDataPath });
    unsubscribe = store.subscribe((garden) => send('garden:changed', garden));
    store.load().then((garden) => send('garden:changed', garden), (error) => send('garden:error', error.message));
  }

  async function chooseFolder() {
    const result = await dialog.showOpenDialog(win, { properties: ['openDirectory', 'createDirectory'] });
    if (result.canceled || !result.filePaths[0]) return null;
    return path.join(result.filePaths[0], SHARED_FILE_NAME);
  }

  function updateSettings(patch) {
    const before = storageKey(settings.get().storage);
    const next = settings.update(patch);
    if (storageKey(next.storage) !== before) connect();
    return next;
  }

  const handlers = {
    'garden:load': () => store.load(),
    'garden:upsertDate': (date) => store.upsertDate(date),
    'garden:deleteDate': (id) => store.deleteDate(id),
    'garden:saveNotes': (notes) => store.saveNotes(notes),
    'settings:get': () => settings.get(),
    'settings:update': updateSettings,
    'settings:chooseFolder': chooseFolder,
    'window:minimize': () => win.minimize(),
    'window:toggleMaximize': () => (win.isMaximized() ? win.unmaximize() : win.maximize()),
    'window:close': () => win.close(),
  };

  for (const [channel, handler] of Object.entries(handlers)) {
    ipcMain.handle(channel, (_event, ...args) => handler(...args));
  }

  connect();
}

module.exports = { registerIpc };
