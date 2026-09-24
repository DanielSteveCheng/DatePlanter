export const MIN_THUMB_SIZE = 16;

export function thumbMetrics({ scrollTop, scrollHeight, clientHeight }, trackHeight, minSize = MIN_THUMB_SIZE) {
  const scrollable = scrollHeight - clientHeight;
  if (scrollable <= 1 || trackHeight <= 0) return null;
  const size = Math.min(trackHeight, Math.max(minSize, (clientHeight / scrollHeight) * trackHeight));
  const maxOffset = trackHeight - size;
  return { size, offset: (scrollTop / scrollable) * maxOffset, maxOffset };
}

export function scrollTopForDrag(startScrollTop, deltaY, { scrollHeight, clientHeight }, maxOffset) {
  if (maxOffset <= 0) return startScrollTop;
  return startScrollTop + deltaY * ((scrollHeight - clientHeight) / maxOffset);
}
