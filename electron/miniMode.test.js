import { describe, expect, it } from 'vitest';
import { placePot } from './miniMode.cjs';

const windowSize = { width: 380, height: 540 };
const pot = { width: 80, height: 96 };
const workArea = { x: 0, y: 0, width: 1920, height: 1040 };

describe('placePot', () => {
  it('moves the window so the pot stays at its bottom centre', () => {
    expect(placePot({ target: { x: 800, y: 900 }, windowSize, pot, workArea })).toEqual({
      position: { x: 610, y: 360 },
      offset: { x: 190, y: 540 },
    });
  });

  it('keeps the window on screen and slides the pot inside it near an edge', () => {
    expect(placePot({ target: { x: 60, y: 120 }, windowSize, pot, workArea })).toEqual({
      position: { x: 0, y: 0 },
      offset: { x: 60, y: 120 },
    });
  });

  it('never lets the pot leave the window', () => {
    expect(placePot({ target: { x: -50, y: 10 }, windowSize, pot, workArea }).offset).toEqual({ x: 40, y: 96 });
  });
});
