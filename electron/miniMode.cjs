const { screen } = require('electron');

const POT_SIZE = Object.freeze({ width: 80, height: 96 });
const DRAG_INTERVAL_MS = 16;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function placePot({ target, windowSize, pot, workArea }) {
  const home = { x: windowSize.width / 2, y: windowSize.height };
  const position = {
    x: Math.round(clamp(target.x - home.x, workArea.x, workArea.x + workArea.width - windowSize.width)),
    y: Math.round(clamp(target.y - home.y, workArea.y, workArea.y + workArea.height - windowSize.height)),
  };
  const offset = {
    x: clamp(target.x - position.x, pot.width / 2, windowSize.width - pot.width / 2),
    y: clamp(target.y - position.y, pot.height, windowSize.height),
  };
  return { position, offset };
}

function createMiniMode(win, { onPotMoved, onCollapsedChange = () => {} }) {
  let collapsed = false;
  let offset = null;
  let dragTimer = null;

  const zoom = () => win.webContents.getZoomFactor();
  const toCss = (point) => ({ x: point.x / zoom(), y: point.y / zoom() });

  function endDrag() {
    clearInterval(dragTimer);
    dragTimer = null;
  }

  return {
    collapse() {
      const { width, height } = win.getBounds();
      offset = { x: width / 2, y: height };
      collapsed = true;
      win.setIgnoreMouseEvents(true, { forward: true });
      onCollapsedChange(true);
    },
    expand() {
      endDrag();
      collapsed = false;
      win.setIgnoreMouseEvents(false);
      onCollapsedChange(false);
    },
    setPotHover(hovering) {
      if (collapsed && !dragTimer) win.setIgnoreMouseEvents(!hovering, { forward: true });
    },
    beginDrag() {
      if (dragTimer || !collapsed) return;
      const start = win.getBounds();
      const cursor = screen.getCursorScreenPoint();
      const grab = { x: cursor.x - (start.x + offset.x), y: cursor.y - (start.y + offset.y) };
      const pot = { width: POT_SIZE.width * zoom(), height: POT_SIZE.height * zoom() };

      dragTimer = setInterval(() => {
        const point = screen.getCursorScreenPoint();
        const bounds = win.getBounds();
        const placed = placePot({
          target: { x: point.x - grab.x, y: point.y - grab.y },
          windowSize: bounds,
          pot,
          workArea: screen.getDisplayNearestPoint(point).workArea,
        });
        if (placed.position.x !== bounds.x || placed.position.y !== bounds.y) {
          win.setBounds({ ...placed.position, width: bounds.width, height: bounds.height });
        }
        if (placed.offset.x !== offset.x || placed.offset.y !== offset.y) {
          offset = placed.offset;
          onPotMoved(toCss(offset));
        }
      }, DRAG_INTERVAL_MS);
    },
    endDrag,
  };
}

module.exports = { POT_SIZE, createMiniMode, placePot };
