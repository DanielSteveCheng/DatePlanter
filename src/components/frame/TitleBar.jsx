import { useBridge } from '../../api/BridgeContext';
import { Surface } from '../../sprites/Surface';
import { IconButton } from '../ui/IconButton';

const TitleButton = (props) => (
  <IconButton {...props} className="app-no-drag text-titlebar-text hover:bg-black/5" />
);

export function TitleBar({ onOpenSettings, onMinimize }) {
  const { window: win } = useBridge();
  return (
    <Surface slot="titlebar" className="app-drag flex items-center justify-between px-4 pt-2 pb-1">
      <span className="text-titlebar font-semibold text-titlebar-text">Date Planter</span>
      <div className="flex items-center gap-1 text-titlebar">
        <TitleButton label="Settings" icon="icon-settings" onClick={onOpenSettings} />
        <TitleButton label="Minimize" icon="icon-minimize" onClick={onMinimize} />
        <TitleButton label="Close" icon="icon-close" onClick={win.close} />
      </div>
    </Surface>
  );
}
