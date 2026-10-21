import { describe, expect, it } from 'vitest';
import { computeStats, rankBy, timeOfDay } from './stats';

const now = new Date('2026-09-24T12:00:00');

const dates = [
  { id: '1', title: 'Picnic', type: 'outdoors', where: 'The Park', when: '2026-07-04T13:00', author: 'Sam' },
  { id: '2', title: 'Sushi', type: 'dinner', where: 'Umi', when: '2026-08-01T19:00', author: 'Alex' },
  { id: '3', title: 'Ramen', type: 'dinner', where: ' the park ', when: '2026-09-19T19:30', author: 'Sam' },
  { id: '4', title: 'Concert', type: 'event', where: '', when: '2026-10-03T20:00', author: 'Alex' },
  { id: '5', title: 'Someday trip', type: 'adventure', where: 'Tokyo', when: '' },
];

describe('computeStats', () => {
  const stats = computeStats(dates, now);

  it('counts completed, upcoming and unscheduled dates', () => {
    expect(stats).toMatchObject({ total: 5, completed: 3, upcoming: 1, unscheduled: 1 });
  });

  it('averages completed dates per calendar month since the first', () => {
    expect(stats.perMonth).toBe(1);
  });

  it('finds the next and most recent dates', () => {
    expect(stats.next).toEqual({ title: 'Concert', inDays: 9 });
    expect(stats.last).toEqual({ title: 'Ramen', daysAgo: 5 });
  });

  it('ranks types with readable labels', () => {
    expect(stats.byType[0]).toEqual({ key: 'dinner', label: 'Dinner', count: 2 });
  });

  it('groups pinned places by identity even when typed differently', () => {
    const umi = { id: 'N42', label: 'Umi, Pittsburgh' };
    const pinned = computeStats([
      { id: 'a', where: 'umi', place: umi },
      { id: 'b', where: 'Umi sushi', place: umi },
    ], now);
    expect(pinned.byLocation).toEqual([{ key: 'N42', label: 'Umi, Pittsburgh', count: 2 }]);
  });

  it('merges locations that differ only in case or spacing', () => {
    expect(stats.byLocation[0]).toEqual({ key: 'the park', label: 'The Park', count: 2 });
    expect(stats.byLocation).toHaveLength(3);
  });

  it('ranks weekdays and times of day from scheduled dates only', () => {
    expect(stats.byWeekday[0]).toMatchObject({ label: 'Saturday', count: 4 });
    expect(stats.byTimeOfDay[0]).toMatchObject({ label: 'Evening', count: 3 });
  });

  it('handles an empty garden', () => {
    expect(computeStats([], now)).toMatchObject({ total: 0, perMonth: 0, next: undefined, last: undefined, byType: [] });
  });
});

it('breaks ranking ties alphabetically', () => {
  expect(rankBy(['b', 'a', 'b', 'a', 'c'], (x) => x).map((r) => r.key)).toEqual(['a', 'b', 'c']);
});

it('buckets hours into times of day', () => {
  expect(timeOfDay(new Date('2026-01-01T02:00'))).toBe('Late night');
  expect(timeOfDay(new Date('2026-01-01T09:00'))).toBe('Morning');
  expect(timeOfDay(new Date('2026-01-01T22:00'))).toBe('Late night');
});
