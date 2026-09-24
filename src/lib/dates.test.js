import { describe, expect, it } from 'vitest';
import { createDate, emptyDateFields, sortNewestFirst, typeLabel, updateDate, validateDate } from './dates';

const now = new Date('2026-01-01T12:00:00Z');

describe('validateDate', () => {
  it('requires a title', () => {
    expect(validateDate(emptyDateFields())).toHaveProperty('title');
    expect(validateDate({ ...emptyDateFields(), title: 'Picnic' })).toEqual({});
  });

  it('rejects unparseable times', () => {
    expect(validateDate({ title: 'x', when: 'not a date' })).toHaveProperty('when');
  });
});

describe('createDate / updateDate', () => {
  it('stamps ids, author and timestamps and drops unknown fields', () => {
    const date = createDate({ title: 'Picnic', bogus: true }, { author: 'Sam', now, id: 'abc' });
    expect(date).toMatchObject({ id: 'abc', title: 'Picnic', author: 'Sam', createdAt: now.toISOString() });
    expect(date).not.toHaveProperty('bogus');
  });

  it('keeps identity and creation time when updating', () => {
    const date = createDate({ title: 'Picnic' }, { now, id: 'abc' });
    const later = new Date('2026-02-01T00:00:00Z');
    const updated = updateDate(date, { ...date, title: 'Beach' }, { now: later });
    expect(updated).toMatchObject({ id: 'abc', title: 'Beach', createdAt: now.toISOString(), updatedAt: later.toISOString() });
  });
});

describe('sortNewestFirst', () => {
  it('orders by when, falling back to createdAt, without mutating', () => {
    const dates = [
      { id: 'a', when: '2026-03-01T10:00' },
      { id: 'b', when: '', createdAt: '2026-05-01T00:00:00Z' },
      { id: 'c', when: '2026-04-01T10:00' },
    ];
    expect(sortNewestFirst(dates).map((d) => d.id)).toEqual(['b', 'c', 'a']);
    expect(dates[0].id).toBe('a');
  });
});

it('labels unknown types as Other', () => {
  expect(typeLabel('dinner')).toBe('Dinner');
  expect(typeLabel('nope')).toBe('Other');
});
