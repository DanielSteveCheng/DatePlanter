import { useBridge } from '../../api/BridgeContext';
import { Surface } from '../../sprites/Surface';

function TitleButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="app-no-drag grid size-5 place-items-center rounded font-bold text-titlebar-text hover:bg-black/5"
    >
      {children}
    </button>
  );
}

export function TitleBar({ onOpenSettings }) {
  const { window: win } = useBridge();
  return (
    <Surface slot="titlebar" className="app-drag flex items-center justify-between px-4 pt-2 pb-1">
      <span className="text-sm font-semibold text-titlebar-text">Date Planter</span>
      <div className="flex items-center gap-1 text-sm">
        <TitleButton label="Settings" onClick={onOpenSettings}>⚙</TitleButton>
        <TitleButton label="Minimize" onClick={win.minimize}>_</TitleButton>
        <TitleButton label="Maximize" onClick={win.toggleMaximize}>○</TitleButton>
        <TitleButton label="Close" onClick={win.close}>✕</TitleButton>
      </div>
    </Surface>
  );
}
