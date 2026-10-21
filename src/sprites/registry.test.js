import { expect, it } from 'vitest';
import { ALL_SLOTS, buildCustomSpriteMap, unknownSpriteNames } from './registry';

it('keys custom sprite files by their slot name', () => {
  expect(
    buildCustomSpriteMap({
      '../assets/sprites/leaf.png': '/leaf.123.png',
      '../assets/sprites/sky-clear.webp': '/sky.webp',
    }),
  ).toEqual({ leaf: '/leaf.123.png', 'sky-clear': '/sky.webp' });
});

it('flags sprite files whose name matches no slot', () => {
  expect(unknownSpriteNames({ leaf: 'a', 'leef': 'b', 'sky-clear': 'c' })).toEqual(['leef']);
});

it('knows every slot exactly once', () => {
  expect(new Set(ALL_SLOTS).size).toBe(ALL_SLOTS.length);
});
