import { describe, expect, it } from 'vitest';
import { placeBubble } from './bubble';

const bud = { width: 18, height: 24 };
const layout = { gap: 10, margin: 8, tailSize: 7, tailInset: 10 };

describe('placeBubble beside the bud', () => {
  it('sits level with the bud when there is room', () => {
    const placed = placeBubble({ placement: 'left', room: { up: 200, down: 200 }, bubbleHeight: 100, bud }, layout);
    expect(placed.style).toEqual({ right: 19, top: -30 });
    expect(placed.tail).toBe('right');
  });

  it('slides up so a tall bubble stays above the bottom edge', () => {
    const placed = placeBubble({ placement: 'left', room: { up: 200, down: 100 }, bubbleHeight: 180, bud }, layout);
    expect(placed.style.top + 180).toBe(100 - 8);
  });

  it('never goes above the top edge, and caps its height to the visible space', () => {
    const placed = placeBubble({ placement: 'left', room: { up: 50, down: 100 }, bubbleHeight: 400, bud }, layout);
    expect(placed.style.top).toBe(-42);
    expect(placed.maxHeight).toBe(134);
  });

  it('keeps the tail pointing at the bud as the bubble slides', () => {
    const level = placeBubble({ placement: 'left', room: { up: 200, down: 200 }, bubbleHeight: 100, bud }, layout);
    const raised = placeBubble({ placement: 'left', room: { up: 200, down: 100 }, bubbleHeight: 180, bud }, layout);
    expect(level.tailTop).toBe(-12 - -30 - 7);
    expect(raised.tailTop).toBeGreaterThan(level.tailTop);
  });
});

describe('placeBubble above and below', () => {
  it('caps the height to the space on that side', () => {
    expect(placeBubble({ placement: 'above', room: { up: 300, down: 50 }, bubbleHeight: 0, bud }, layout).maxHeight).toBe(258);
    expect(placeBubble({ placement: 'below', room: { up: 50, down: 300 }, bubbleHeight: 0, bud }, layout).maxHeight).toBe(282);
  });
});
