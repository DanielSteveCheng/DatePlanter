import { useBridge } from '../../api/BridgeContext';
import { Sprite } from '../../sprites/Sprite';
import { squareSize } from '../../sprites/sizes';

export function ResizeGrip() {
  const { window: win } = useBridge();

  function begin(event) {
    event.currentTarget.setPointerCapture(event.pointerId);
    win.beginResize();
  }

  return (
    <div
      role="presentation"
      title="Drag to resize"
      onPointerDown={begin}
      onLostPointerCapture={() => win.endResize()}
      className="app-no-drag absolute bottom-1 right-3 z-40 cursor-nwse-resize opacity-70 hover:opacity-100"
      style={squareSize('resize-grip')}
    >
      <Sprite slot="resize-grip" className="size-full" />
    </div>
  );
}
