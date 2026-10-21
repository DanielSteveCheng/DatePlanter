import { expect, it } from 'vitest';
import { isWebUrl } from './externalLinks.cjs';

it('only opens web links in the browser', () => {
  expect(isWebUrl('https://www.openstreetmap.org/copyright')).toBe(true);
  expect(isWebUrl('http://leafletjs.com')).toBe(true);
  expect(isWebUrl('file:///C:/Windows/system32/calc.exe')).toBe(false);
  expect(isWebUrl('javascript:alert(1)')).toBe(false);
});
