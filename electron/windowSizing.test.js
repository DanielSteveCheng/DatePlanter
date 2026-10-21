import { describe, expect, it } from 'vitest';
import { fitToRatio, windowOptions } from './windowSizing.cjs';

const base = { origin: { x: 100, y: 100 }, ratio: 0.5, minWidth: 200, maxWidth: 2000, maxHeight: 2000 };

describe('fitToRatio', () => {
  it('follows whichever axis the cursor pulled further, keeping the ratio', () => {
    expect(fitToRatio({ ...base, cursor: { x: 500, y: 300 } })).toEqual({ width: 400, height: 800 });
    expect(fitToRatio({ ...base, cursor: { x: 300, y: 1100 } })).toEqual({ width: 500, height: 1000 });
  });

  it('respects the minimum width', () => {
    expect(fitToRatio({ ...base, cursor: { x: 110, y: 110 } })).toEqual({ width: 200, height: 400 });
  });

  it('stays within the screen', () => {
    expect(fitToRatio({ ...base, maxHeight: 600, cursor: { x: 900, y: 900 } })).toEqual({ width: 300, height: 600 });
  });
});

it('derives a minimum height matching the base ratio', () => {
  expect(windowOptions({ width: 380, height: 540 }, 300)).toMatchObject({ minWidth: 300, minHeight: 426 });
});
