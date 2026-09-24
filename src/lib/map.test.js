import { expect, it } from 'vitest';
import { groupDatesByPlace } from './map';

const umi = { id: 'N42', label: 'Umi, Pittsburgh', latitude: 40.44, longitude: -79.99 };
const park = { id: 'W7', label: 'Frick Park', latitude: 40.43, longitude: -79.9 };

it('puts one pin per place, busiest first, and skips unpinned dates', () => {
  const dates = [
    { id: 'a', place: park },
    { id: 'b', place: umi },
    { id: 'c', place: umi },
    { id: 'd', where: 'Somewhere', place: null },
  ];
  const pins = groupDatesByPlace(dates);
  expect(pins.map((pin) => [pin.key, pin.dates.map((d) => d.id)])).toEqual([
    ['N42', ['b', 'c']],
    ['W7', ['a']],
  ]);
  expect(pins[0]).toMatchObject({ label: 'Umi, Pittsburgh', latitude: 40.44, longitude: -79.99 });
});
