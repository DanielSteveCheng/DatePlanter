const { createFileStore } = require('./fileStore.cjs');
const { createSupabaseStore } = require('./supabaseStore.cjs');

const isSupabaseReady = (config) => config?.type === 'supabase' && config.supabaseUrl && config.supabaseKey;

function createStore(config, { defaultFilePath }) {
  if (isSupabaseReady(config)) {
    return createSupabaseStore({ url: config.supabaseUrl, key: config.supabaseKey });
  }
  return createFileStore(config?.filePath || defaultFilePath);
}

function storageKey(config) {
  return isSupabaseReady(config)
    ? `supabase:${config.supabaseUrl}:${config.supabaseKey}`
    : `file:${config?.filePath ?? ''}`;
}

module.exports = { createStore, storageKey };
