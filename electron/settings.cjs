const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_SETTINGS = Object.freeze({
  author: '',
  units: 'fahrenheit',
  location: null,
  weatherPreview: 'live',
  devMode: false,
  keepOnTop: 'pot',
  deviceId: '',
  personId: '',
  storage: { type: 'file', filePath: '', supabaseUrl: '', supabaseKey: '' },
});

function mergeSettings(base, patch = {}) {
  return {
    ...base,
    ...patch,
    storage: { ...base.storage, ...(patch.storage ?? {}) },
  };
}

function createSettingsStore(filePath) {
  let current = mergeSettings(DEFAULT_SETTINGS, readJson(filePath));

  const store = {
    get: () => current,
    update(patch) {
      current = mergeSettings(current, patch);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(current, null, 2));
      return current;
    },
  };
  if (!current.deviceId) store.update({ deviceId: crypto.randomUUID() });
  return store;
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return {};
  }
}

module.exports = { createSettingsStore };
