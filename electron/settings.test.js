import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { createSettingsStore } from './settings.cjs';

let dir;
let file;

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'date-planter-settings-'));
  file = path.join(dir, 'settings.json');
});

afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

it('gives a new computer a device id and saves it', () => {
  const settings = createSettingsStore(file).get();
  expect(settings.deviceId).toMatch(/[0-9a-f-]{36}/);
  expect(JSON.parse(fs.readFileSync(file, 'utf8')).deviceId).toBe(settings.deviceId);
});

it('keeps saved settings and fills in new defaults', () => {
  fs.writeFileSync(file, JSON.stringify({ author: 'Daniel', storage: { type: 'file', filePath: 'C:/mine.json' } }));
  const settings = createSettingsStore(file).get();
  expect(settings).toMatchObject({ author: 'Daniel', units: 'fahrenheit', storage: { type: 'file', filePath: 'C:/mine.json', supabaseUrl: '' } });
});
