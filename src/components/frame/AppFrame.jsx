import { Surface } from '../../sprites/Surface';
import { TitleBar } from './TitleBar';

export function AppFrame({ onOpenSettings, children }) {
  return (
    <div className="h-full p-1.5">
      <Surface
        slot="frame"
        className="flex h-full flex-col overflow-hidden rounded-[28px] border-4 border-frame-edge bg-frame shadow-lg"
      >
        <TitleBar onOpenSettings={onOpenSettings} />
        <div className="relative flex min-h-0 flex-1 flex-col px-2.5 pb-2.5">{children}</div>
      </Surface>
    </div>
  );
}
