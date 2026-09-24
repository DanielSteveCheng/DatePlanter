import { describe, expect, it } from 'vitest';
import { DATE_TYPES } from './dates';
import { createDevDates, isDevDate } from './devDates';

const now = new Date('2026-09-24T12:00:00');

describe('createDevDates', () => {
  it('numbers leaves from the given start with dev ids', () => {
    const dates = createDevDates(3, { startNumber: 4, now, random: () => 0.5 });
    expect(dates.map((d) => d.id)).toEqual(['dev-4', 'dev-5', 'dev-6']);
    expect(dates.map((d) => d.title)).toEqual(['Dev leaf 4', 'Dev leaf 5', 'Dev leaf 6']);
    expect(dates.every(isDevDate)).toBe(true);
  });

  it('pins places around a centre when one is given', () => {
    const [unpinned] = createDevDates(1, { now, random: () => 0 });
    expect(unpinned.place).toBeNull();
    const [pinned] = createDevDates(1, { now, random: () => 0, center: { latitude: 40, longitude: -80 } });
    expect(pinned.place).toMatchObject({ id: 'dev-place-0', label: 'The Park' });
    expect(Math.abs(pinned.place.latitude - 40)).toBeLessThan(0.1);
  });

  it('fills every field the date form expects', () => {
    const [date] = createDevDates(1, { now, random: () => 0 });
    expect(date).toMatchObject({ where: 'The Park', type: DATE_TYPES[0].id, when: '2026-07-26T12:00' });
  });
});

it('recognises only dev ids', () => {
  expect(isDevDate({ id: 'dev-1' })).toBe(true);
  expect(isDevDate({ id: '3f2a' })).toBe(false);
  expect(isDevDate(undefined)).toBe(false);
});
