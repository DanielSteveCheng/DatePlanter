export const BUBBLE_LAYOUT = {
  gap: 10,
  margin: 8,
  tailSize: 7,
  tailInset: 10,
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Places a speech bubble next to a bud whose bottom-centre is the anchor (0, 0).
// `room` is how many px of visible space there are above and below the anchor.
export function placeBubble({ placement, room, bubbleHeight, bud }, layout = BUBBLE_LAYOUT) {
  const { gap, margin, tailSize, tailInset } = layout;

  if (placement === 'below') {
    return { tail: 'up', maxHeight: room.down - gap - margin, style: { top: gap, left: 0, translate: '-50% 0' } };
  }
  if (placement === 'above') {
    return {
      tail: 'down',
      maxHeight: room.up - bud.height - gap - margin,
      style: { bottom: bud.height + gap, left: 0, translate: '-50% 0' },
    };
  }

  const available = room.up + room.down - margin * 2;
  const highest = -room.up + margin;
  const lowest = room.down - margin - bubbleHeight;
  const top = Math.max(highest, Math.min(-bud.height - 6, lowest));
  const budMiddle = -bud.height / 2;
  const tailTop = clamp(budMiddle - top - tailSize, tailInset, Math.max(tailInset, bubbleHeight - tailInset - tailSize * 2));
  return { tail: 'right', tailTop, maxHeight: available, style: { right: bud.width / 2 + gap, top } };
}
