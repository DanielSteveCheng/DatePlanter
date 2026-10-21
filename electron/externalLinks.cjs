const { shell } = require('electron');

const isWebUrl = (url) => /^https?:\/\//i.test(url);

function openLinksExternally(webContents) {
  const appUrl = () => webContents.getURL();

  webContents.setWindowOpenHandler(({ url }) => {
    if (isWebUrl(url)) shell.openExternal(url);
    return { action: 'deny' };
  });

  webContents.on('will-navigate', (event, url) => {
    if (url === appUrl()) return;
    event.preventDefault();
    if (isWebUrl(url)) shell.openExternal(url);
  });
}

module.exports = { isWebUrl, openLinksExternally };
