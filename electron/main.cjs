const path = require('node:path');
const { app, BrowserWindow } = require('electron');
const { createSettingsStore } = require('./settings.cjs');
const { registerIpc } = require('./ipc.cjs');
const { BASE_SIZE, createResizer, windowOptions } = require('./windowSizing.cjs');
const { createMiniMode } = require('./miniMode.cjs');
const { createOnTop } = require('./onTop.cjs');
const { identifyApp } = require('./identify.cjs');
const { openLinksExternally } = require('./externalLinks.cjs');

const DATA_FOLDER = 'date-planter';

app.setPath(
  'userData',
  process.env.DATE_PLANTER_PROFILE
    ? path.resolve(process.env.DATE_PLANTER_PROFILE)
    : path.join(app.getPath('appData'), DATA_FOLDER),
);

if (!app.requestSingleInstanceLock()) app.quit();

function createWindow() {
  const win = new BrowserWindow({
    ...windowOptions(),
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      sandbox: true,
    },
  });
  win.setAspectRatio(BASE_SIZE.width / BASE_SIZE.height);

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
  app.on('second-instance', () => {
    if (win.isMinimized()) win.restore();
    win.show();
    win.focus();
  });
  identifyApp(win.webContents.session, app.getVersion());
  openLinksExternally(win.webContents);
  const resizer = createResizer(win);
  const onTop = createOnTop(win, () => settings.get().keepOnTop);
  const miniMode = createMiniMode(win, {
    onPotMoved: (offset) => !win.isDestroyed() && win.webContents.send('window:potMoved', offset),
    onCollapsedChange: onTop.setCollapsed,
  });
  onTop.refresh();
  win.webContents.on('did-finish-load', resizer.applyZoom);
  registerIpc({ win, settings, resizer, miniMode, onTop, defaultDataPath: path.join(userData, 'garden.json') });
});

app.on('window-all-closed', () => app.quit());
