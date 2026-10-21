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
    upsertMessage: invoke('garden:upsertMessage'),
    deleteMessage: invoke('garden:deleteMessage'),
    upsertPerson: invoke('garden:upsertPerson'),
    onChange: (callback) => listen('garden:changed', callback),
    onError: (callback) => listen('garden:error', callback),
  },
  settings: {
    get: invoke('settings:get'),
    update: invoke('settings:update'),
    chooseFolder: invoke('settings:chooseFolder'),
  },
  window: {
    collapse: (potSize) => ipcRenderer.invoke('window:collapse', potSize),
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
