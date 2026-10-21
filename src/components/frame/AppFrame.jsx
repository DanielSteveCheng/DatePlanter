import { Surface } from '../../sprites/Surface';
import { SPRITE_SIZES } from '../../sprites/sizes';
import { cn } from '../../lib/cn';
import { TitleBar } from './TitleBar';
import { ResizeGrip } from './ResizeGrip';

export function AppFrame({ className, onOpenSettings, onOpenMessages, onMinimize, children }) {
  return (
    <div className={cn('h-full p-1.5', className)}>
      <Surface
        slot="frame"
        className="relative flex h-full flex-col overflow-hidden border-frame-edge bg-frame shadow-lg"
        style={{ borderWidth: SPRITE_SIZES['frame-border'], borderRadius: SPRITE_SIZES['frame-radius'] }}
      >
        <TitleBar onOpenSettings={onOpenSettings} onOpenMessages={onOpenMessages} onMinimize={onMinimize} />
        <div className="relative flex min-h-0 flex-1 flex-col px-2.5 pb-2.5">{children}</div>
        <ResizeGrip />
      </Surface>
    </div>
  );
}
