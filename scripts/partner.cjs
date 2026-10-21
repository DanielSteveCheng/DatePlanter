// Opens a second Date Planter window with its own profile, sharing the same garden as yours.
// Uses the running `npm run dev` server if there is one, otherwise a production build.
const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');

const DEV_SERVER = { host: 'localhost', port: 5173 };

const ROOT = path.join(__dirname, '..');
const PROFILE = path.join(ROOT, '.profiles', 'partner');
const PROFILE_SETTINGS = path.join(PROFILE, 'settings.json');

function appDataFolder() {
  if (process.platform === 'win32') return process.env.APPDATA;
  if (process.platform === 'darwin') return path.join(os.homedir(), 'Library', 'Application Support');
  return process.env.XDG_CONFIG_HOME ?? path.join(os.homedir(), '.config');
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return {};
  }
}

if (!fs.existsSync(PROFILE_SETTINGS)) {
  const yours = readJson(path.join(appDataFolder(), 'date-planter', 'settings.json'));
  fs.mkdirSync(PROFILE, { recursive: true });
  fs.writeFileSync(
    PROFILE_SETTINGS,
    JSON.stringify({ author: 'Partner (test)', location: yours.location ?? null, storage: yours.storage }, null, 2),
  );
  console.log(`Created partner profile in ${path.relative(ROOT, PROFILE)} using your sharing settings.`);
}

function isDevServerRunning() {
  return new Promise((resolve) => {
    const socket = net.connect(DEV_SERVER, () => {
      socket.end();
      resolve(true);
    });
    socket.on('error', () => resolve(false));
    socket.setTimeout(1000, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

async function main() {
  const env = { ...process.env, DATE_PLANTER_PROFILE: PROFILE };
  delete env.ELECTRON_RUN_AS_NODE;
  delete env.VITE_DEV_SERVER_URL;

  if (await isDevServerRunning()) {
    env.VITE_DEV_SERVER_URL = `http://${DEV_SERVER.host}:${DEV_SERVER.port}`;
    console.log('Using the running dev server (live reload).');
  } else {
    console.log('No dev server running, so building the app first…');
    const build = spawnSync('npx', ['vite', 'build'], { cwd: ROOT, stdio: 'inherit', shell: true });
    if (build.status !== 0) process.exit(build.status ?? 1);
  }

  spawn(require('electron'), ['.'], { cwd: ROOT, env, stdio: 'inherit' }).on('exit', (code) => process.exit(code ?? 0));
}

main();
