export const DATE_TYPES = [
  { id: 'dinner', label: 'Dinner' },
  { id: 'outdoors', label: 'Outdoors' },
  { id: 'movie', label: 'Movie' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'cozy', label: 'Cozy night in' },
  { id: 'event', label: 'Event' },
  { id: 'other', label: 'Other' },
];

export const DATE_FIELDS = ['title', 'where', 'when', 'type', 'activities', 'notes'];

export const emptyDateFields = () => ({ title: '', where: '', when: '', type: 'other', activities: '', notes: '' });

const pickFields = (source) => Object.fromEntries(DATE_FIELDS.map((field) => [field, source[field] ?? '']));

export function validateDate(fields) {
  const errors = {};
  if (!fields.title?.trim()) errors.title = 'Give your date a name';
  if (fields.when && Number.isNaN(Date.parse(fields.when))) errors.when = 'That time looks off';
  return errors;
}

export function createDate(fields, { author = '', now = new Date(), id = crypto.randomUUID() } = {}) {
  const timestamp = now.toISOString();
  return { id, ...pickFields(fields), author, createdAt: timestamp, updatedAt: timestamp };
}

export function updateDate(date, fields, { now = new Date() } = {}) {
  return { ...date, ...pickFields(fields), updatedAt: now.toISOString() };
}

const sortKey = (date) => date.when || date.createdAt || '';

export const sortNewestFirst = (dates) => [...dates].sort((a, b) => sortKey(b).localeCompare(sortKey(a)));

export const typeLabel = (typeId) => DATE_TYPES.find((type) => type.id === typeId)?.label ?? 'Other';

export function formatWhen(when, locale) {
  if (!when) return 'Someday';
  const date = new Date(when);
  if (Number.isNaN(date.getTime())) return when;
  return date.toLocaleString(locale, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}
