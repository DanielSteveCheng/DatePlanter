const ON_TOP_MODES = ['pot', 'always', 'never'];

function shouldStayOnTop(mode, collapsed) {
  if (mode === 'always') return true;
  if (mode === 'never') return false;
  return collapsed;
}

function createOnTop(win, getMode) {
  let collapsed = false;

  function refresh() {
    if (!win.isDestroyed()) win.setAlwaysOnTop(shouldStayOnTop(getMode(), collapsed), 'floating');
  }

  return {
    refresh,
    setCollapsed(next) {
      collapsed = next;
      refresh();
    },
  };
}

module.exports = { ON_TOP_MODES, createOnTop, shouldStayOnTop };
