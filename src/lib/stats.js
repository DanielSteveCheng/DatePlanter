import { typeLabel } from './dates';
import { placeKey, placeLabel } from './places';

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIMES_OF_DAY = [
  { before: 5, label: 'Late night' },
  { before: 12, label: 'Morning' },
  { before: 17, label: 'Afternoon' },
  { before: 21, label: 'Evening' },
  { before: 24, label: 'Late night' },
];

export function parseWhen(date) {
  if (!date.when) return null;
  const parsed = new Date(date.when);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function rankBy(items, keyOf, labelOf = (key) => key) {
  const counts = new Map();
  for (const item of items) {
    const key = keyOf(item);
    if (key == null || key === '') continue;
    const entry = counts.get(key) ?? { key, label: labelOf(key, item), count: 0 };
    entry.count += 1;
    counts.set(key, entry);
  }
  return [...counts.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export const timeOfDay = (when) => TIMES_OF_DAY.find((slot) => when.getHours() < slot.before).label;

const monthsBetween = (start, end) =>
  (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth() + 1;

const daysBetween = (from, to) => Math.round((to - from) / DAY_MS);

const byTime = (a, b) => a.when - b.when;

export function computeStats(dates, now = new Date()) {
  const timed = dates
    .map((date) => ({ date, when: parseWhen(date) }))
    .filter((entry) => entry.when)
    .sort(byTime);
  const past = timed.filter((entry) => entry.when < now);
  const upcoming = timed.filter((entry) => entry.when >= now);
  const first = timed[0];
  const lastPast = past.at(-1);
  const next = upcoming[0];

  return {
    total: dates.length,
    completed: past.length,
    upcoming: upcoming.length,
    unscheduled: dates.length - timed.length,
    perMonth: first && past.length ? past.length / monthsBetween(first.when, now) : 0,
    next: next && { title: next.date.title, inDays: daysBetween(now, next.when) },
    last: lastPast && { title: lastPast.date.title, daysAgo: daysBetween(lastPast.when, now) },
    byType: rankBy(dates, (date) => date.type || 'other', typeLabel),
    byWeekday: rankBy(timed, (entry) => WEEKDAYS[entry.when.getDay()]),
    byTimeOfDay: rankBy(timed, (entry) => timeOfDay(entry.when)),
    byLocation: rankBy(dates, placeKey, (_key, date) => placeLabel(date)),
    byMonth: rankBy(timed, (entry) => entry.when.toLocaleDateString(undefined, { month: 'long' })),
    byAuthor: rankBy(dates, (date) => date.author?.trim()),
  };
}
