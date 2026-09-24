import { useCallback, useEffect, useRef, useState } from 'react';
import { Surface } from '../../sprites/Surface';
import { scrollTopForDrag, thumbMetrics } from '../../lib/scroll';
import { cn } from '../../lib/cn';

export function ScrollArea({ className, children }) {
  const viewportRef = useRef(null);
  const contentRef = useRef(null);
  const dragRef = useRef(null);
  const [thumb, setThumb] = useState(null);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    if (viewport) setThumb(thumbMetrics(viewport, viewport.clientHeight));
  }, []);

  useEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewportRef.current);
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [measure]);

  function startDrag(event) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { y: event.clientY, scrollTop: viewportRef.current.scrollTop };
  }

  function drag(event) {
    if (!dragRef.current || !thumb) return;
    const viewport = viewportRef.current;
    viewport.scrollTop = scrollTopForDrag(dragRef.current.scrollTop, event.clientY - dragRef.current.y, viewport, thumb.maxOffset);
  }

  return (
    <div className={cn('relative flex min-h-0 flex-col', className)}>
      <div ref={viewportRef} onScroll={measure} className="scrollbar-none min-h-0 flex-1 overflow-y-auto pr-2.5">
        <div ref={contentRef} className="p-1">
          {children}
        </div>
      </div>
      {thumb && (
        <Surface slot="scroll-track" className="absolute inset-y-0 right-0 w-1.5 rounded-full bg-scroll-track">
          <Surface
            slot="scroll-thumb"
            onPointerDown={startDrag}
            onPointerMove={drag}
            onLostPointerCapture={() => (dragRef.current = null)}
            className="absolute inset-x-0 cursor-grab rounded-full bg-scroll-thumb hover:brightness-110 active:cursor-grabbing"
            style={{ top: thumb.offset, height: thumb.size }}
          />
        </Surface>
      )}
    </div>
  );
}
