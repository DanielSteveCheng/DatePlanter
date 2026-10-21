import { describe, expect, it } from 'vitest';
import { CLOSED, selectionReducer } from './selection';

describe('selectionReducer', () => {
  it('opens a blank form when planting', () => {
    expect(selectionReducer(CLOSED, { type: 'plant' })).toEqual({ mode: 'new', dateId: null });
  });

  it('toggles a leaf closed when clicked twice', () => {
    const viewing = selectionReducer(CLOSED, { type: 'view', id: 'a' });
    expect(viewing).toEqual({ mode: 'view', dateId: 'a' });
    expect(selectionReducer(viewing, { type: 'view', id: 'a' })).toBe(CLOSED);
  });

  it('edits the viewed date and returns to viewing after save', () => {
    const editing = selectionReducer({ mode: 'view', dateId: 'a' }, { type: 'edit' });
    expect(editing).toEqual({ mode: 'edit', dateId: 'a' });
    expect(selectionReducer(editing, { type: 'saved', id: 'a' })).toEqual({ mode: 'view', dateId: 'a' });
  });
});
