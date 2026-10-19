// "floating" and lower levels make Electron tuck the window behind the Windows taskbar on every
// focus, which can drop its topmost status entirely. "pop-up-menu" is a plain topmost window.
const ON_TOP_LEVEL = 'pop-up-menu';

function shouldStayOnTop(mode, collapsed) {
  if (mode === 'always') return true;
  if (mode === 'never') return false;
  return collapsed;
}

function createOnTop(win, getMode) {
  let collapsed = false;

  function refresh() {
    if (win.isDestroyed()) return;
    if (shouldStayOnTop(getMode(), collapsed)) {
      win.setAlwaysOnTop(true, ON_TOP_LEVEL);
      win.moveTop();
    } else if (win.isAlwaysOnTop()) {
      win.setAlwaysOnTop(false);
    }
  }

  win.on('show', refresh);
  win.on('focus', refresh);

  return {
    refresh,
    setCollapsed(next) {
      collapsed = next;
      refresh();
    },
  };
}

module.exports = { createOnTop, shouldStayOnTop };
