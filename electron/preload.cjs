const { contextBridge, ipcRenderer } = require('electron');

const invoke = (channel) => (...args) => ipcRenderer.invoke(channel, ...args);
const command = (channel) => () => ipcRenderer.invoke(channel);

function listen(channel, callback) {
  const handler = (_event, payload) => callback(payload);
  ipcRenderer.on(channel, handler);
  return () => ipcRenderer.removeListener(channel, handler);
}

contextBridge.exposeInMainWorld('dateplanter', {
  garden: {
    load: invoke('garden:load'),
    upsertDate: invoke('garden:upsertDate'),
    deleteDate: invoke('garden:deleteDate'),
    saveNotes: invoke('garden:saveNotes'),
    onChange: (callback) => listen('garden:changed', callback),
    onError: (callback) => listen('garden:error', callback),
  },
  settings: {
    get: invoke('settings:get'),
    update: invoke('settings:update'),
    chooseFolder: invoke('settings:chooseFolder'),
  },
  window: {
    collapse: command('window:collapse'),
    expand: command('window:expand'),
    beginDrag: command('window:beginDrag'),
    endDrag: command('window:endDrag'),
    setPotHover: (hovering) => ipcRenderer.invoke('window:setPotHover', Boolean(hovering)),
    onPotMoved: (callback) => listen('window:potMoved', callback),
    close: command('window:close'),
    beginResize: command('window:beginResize'),
    endResize: command('window:endResize'),
  },
});
