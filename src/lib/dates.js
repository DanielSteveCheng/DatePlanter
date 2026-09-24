export const DATE_TYPES = [
  { id: 'dinner', label: 'Dinner' },
  { id: 'outdoors', label: 'Outdoors' },
  { id: 'movie', label: 'Movie' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'cozy', label: 'Cozy night in' },
  { id: 'event', label: 'Event' },
  { id: 'other', label: 'Other' },
];

const FIELD_DEFAULTS = Object.freeze({
  title: '',
  where: '',
  place: null,
  when: '',
  type: 'other',
  activities: '',
  notes: '',
});

export const DATE_FIELDS = Object.keys(FIELD_DEFAULTS);

export const emptyDateFields = () => ({ ...FIELD_DEFAULTS });

const pickFields = (source) =>
  Object.fromEntries(DATE_FIELDS.map((field) => [field, source[field] ?? FIELD_DEFAULTS[field]]));

export const DATE_STATUS_LABELS = { upcoming: 'Upcoming', past: 'Previous Date' };

const pad = (n) => String(n).padStart(2, '0');

export const toDateTimeInputValue = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;

const startOfMinute = (date) => {
  const start = new Date(date);
  start.setSeconds(0, 0);
  return start;
};

export function validateDate(fields, { allowPast = true, now = new Date() } = {}) {
  const errors = {};
  const when = fields.when ? Date.parse(fields.when) : null;
  if (!fields.title?.trim()) errors.title = 'Give your date a name';
  if (Number.isNaN(when)) errors.when = 'That time looks off';
  else if (when !== null && !allowPast && when < startOfMinute(now).getTime()) errors.when = "Pick a time that hasn't passed yet";
  return errors;
}

export function dateStatus(date, now = new Date()) {
  const when = date.when ? Date.parse(date.when) : NaN;
  if (Number.isNaN(when)) return null;
  return when >= now.getTime() ? 'upcoming' : 'past';
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
