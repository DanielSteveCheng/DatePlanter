import { describe, expect, it, vi } from 'vitest';
import { createEmitter, normalizeGarden, removeById, upsertById } from './garden.cjs';

describe('garden helpers', () => {
  it('normalizes malformed data', () => {
    expect(normalizeGarden(null)).toEqual({ dates: [], notes: '' });
    expect(normalizeGarden({ dates: [{ id: 'a' }, null, { title: 'no id' }], notes: 5 })).toEqual({ dates: [{ id: 'a' }], notes: '' });
  });

  it('upserts and removes by id', () => {
    const list = upsertById([{ id: 'a', v: 1 }], { id: 'b', v: 2 });
    expect(upsertById(list, { id: 'a', v: 3 })).toEqual([{ id: 'a', v: 3 }, { id: 'b', v: 2 }]);
    expect(removeById(list, 'a')).toEqual([{ id: 'b', v: 2 }]);
  });

  it('only emits when content changes', () => {
    const emitter = createEmitter();
    const listener = vi.fn();
    emitter.subscribe(listener);
    emitter.remember({ dates: [], notes: 'x' });
    emitter.emitIfChanged({ dates: [], notes: 'x' });
    expect(listener).not.toHaveBeenCalled();
    emitter.emitIfChanged({ dates: [], notes: 'y' });
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
