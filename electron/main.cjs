const path = require('node:path');
const { app, BrowserWindow } = require('electron');
const { createSettingsStore } = require('./settings.cjs');
const { registerIpc } = require('./ipc.cjs');

const WINDOW = { width: 380, height: 540, minWidth: 320, minHeight: 460 };

function createWindow() {
  const win = new BrowserWindow({
    ...WINDOW,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      sandbox: true,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
  return win;
}

app.whenReady().then(() => {
  const userData = app.getPath('userData');
  const settings = createSettingsStore(path.join(userData, 'settings.json'));
  const win = createWindow();
  registerIpc({ win, settings, defaultDataPath: path.join(userData, 'garden.json') });
});

app.on('window-all-closed', () => app.quit());
