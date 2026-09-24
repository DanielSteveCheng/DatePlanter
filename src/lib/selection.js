export const CLOSED = { mode: 'closed', dateId: null };

export function selectionReducer(state, action) {
  switch (action.type) {
    case 'plant':
      return { mode: 'new', dateId: null };
    case 'view':
      return state.mode === 'view' && state.dateId === action.id ? CLOSED : { mode: 'view', dateId: action.id };
    case 'edit':
      return { mode: 'edit', dateId: state.dateId };
    case 'saved':
      return { mode: 'view', dateId: action.id };
    case 'close':
      return CLOSED;
    default:
      return state;
  }
}
