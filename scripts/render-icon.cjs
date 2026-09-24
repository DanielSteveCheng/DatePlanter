const fs = require('node:fs');
const path = require('node:path');
const { app, BrowserWindow } = require('electron');

const ROOT = path.join(__dirname, '..');
const OUTPUT = path.join(ROOT, 'build', 'icon.png');
const SIZE = 512;
const THEME = fs.readFileSync(path.join(ROOT, 'src', 'styles', 'theme.css'), 'utf8');
const CUSTOM_POT = ['png', 'webp', 'svg', 'jpg'].map((ext) => path.join(ROOT, 'src', 'assets', 'sprites', `mini-pot.${ext}`)).find(fs.existsSync);

const POT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 0 120 120">
  <rect x="46" y="30" width="8" height="30" rx="3" fill="var(--color-stem)" />
  <path d="M50 36 C44 20 26 12 10 16 C16 32 34 40 50 36 Z" fill="var(--color-leaf)" />
  <path d="M50 36 C56 20 74 12 90 16 C84 32 66 40 50 36 Z" fill="var(--color-leaf)" />
  <path d="M46 34 C40 24 28 20 20 21 C26 30 36 34 46 34 Z" fill="var(--color-leaf-selected)" />
  <path d="M54 34 C60 24 72 20 80 21 C74 30 64 34 54 34 Z" fill="var(--color-leaf-selected)" />
  <rect x="20" y="74" width="60" height="42" rx="12" fill="var(--color-pot)" />
  <rect x="10" y="56" width="80" height="26" rx="11" fill="var(--color-pot-rim)" />
  <path d="M50 108 C38 100 38 90 45 90 C47.5 90 49 91.5 50 93.5 C51 91.5 52.5 90 55 90 C62 90 62 100 50 108 Z" fill="var(--color-pot-heart)" />
</svg>`;

const themeColor = (name) => new RegExp(`--${name}:\s*([^;]+);`).exec(THEME)?.[1].trim() ?? '#000';
const resolveColors = (svg) => svg.replace(/var\(--([\w-]+)\)/g, (_, name) => themeColor(name));

function artwork() {
  if (!CUSTOM_POT) return `data:image/svg+xml;base64,${Buffer.from(resolveColors(POT_SVG)).toString('base64')}`;
  const type = path.extname(CUSTOM_POT) === '.svg' ? 'image/svg+xml' : `image/${path.extname(CUSTOM_POT).slice(1)}`;
  return `data:${type};base64,${fs.readFileSync(CUSTOM_POT).toString('base64')}`;
}

const page = `<html><body style="margin:0;background:transparent">
  <img src="${artwork()}" style="width:${SIZE}px;height:${SIZE}px;object-fit:contain;display:block" />
</body></html>`;

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: SIZE,
    height: SIZE,
    show: false,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    webPreferences: { offscreen: true },
  });
  await win.loadURL(`data:text/html;base64,${Buffer.from(page).toString('base64')}`);
  await new Promise((resolve) => setTimeout(resolve, 300));
  const image = (await win.webContents.capturePage()).resize({ width: SIZE, height: SIZE, quality: 'best' });
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, image.toPNG());
  console.log(`Wrote ${path.relative(ROOT, OUTPUT)} (${CUSTOM_POT ? 'custom mini-pot sprite' : 'default pot'})`);
  app.quit();
});
