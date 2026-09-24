import { expect, it } from 'vitest';
import { buildCustomSpriteMap } from './registry';

it('keys custom sprite files by their slot name', () => {
  expect(
    buildCustomSpriteMap({
      '../assets/sprites/leaf.png': '/leaf.123.png',
      '../assets/sprites/sky-clear.webp': '/sky.webp',
    }),
  ).toEqual({ leaf: '/leaf.123.png', 'sky-clear': '/sky.webp' });
});
