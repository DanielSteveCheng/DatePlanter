const { screen } = require('electron');

const BASE_SIZE = Object.freeze({ width: 380, height: 540 });
const MIN_WIDTH = 300;
const RESIZE_INTERVAL_MS = 16;

function fitToRatio({ origin, cursor, ratio, minWidth, maxWidth, maxHeight }) {
  const wanted = Math.max(cursor.x - origin.x, (cursor.y - origin.y) * ratio);
  const width = Math.round(Math.max(minWidth, Math.min(wanted, maxWidth, maxHeight * ratio)));
  return { width, height: Math.round(width / ratio) };
}

function createResizer(win, { base = BASE_SIZE, minWidth = MIN_WIDTH } = {}) {
  const ratio = base.width / base.height;
  let timer = null;

  const applyZoom = () => win.webContents.setZoomFactor(win.getBounds().width / base.width);

  function step() {
    const bounds = win.getBounds();
    const { workArea } = screen.getDisplayMatching(bounds);
    const size = fitToRatio({
      origin: bounds,
      cursor: screen.getCursorScreenPoint(),
      ratio,
      minWidth,
      maxWidth: workArea.x + workArea.width - bounds.x,
      maxHeight: workArea.y + workArea.height - bounds.y,
    });
    if (size.width === bounds.width && size.height === bounds.height) return;
    win.setBounds({ x: bounds.x, y: bounds.y, ...size });
    applyZoom();
  }

  return {
    start() {
      timer ??= setInterval(step, RESIZE_INTERVAL_MS);
    },
    stop() {
      clearInterval(timer);
      timer = null;
    },
    applyZoom,
  };
}

const windowOptions = (base = BASE_SIZE, minWidth = MIN_WIDTH) => ({
  ...base,
  minWidth,
  minHeight: Math.round(minWidth * (base.height / base.width)),
});

module.exports = { BASE_SIZE, createResizer, fitToRatio, windowOptions };
