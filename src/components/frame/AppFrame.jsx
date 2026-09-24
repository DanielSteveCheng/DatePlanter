import { Surface } from '../../sprites/Surface';
import { cn } from '../../lib/cn';
import { TitleBar } from './TitleBar';
import { ResizeGrip } from './ResizeGrip';

export function AppFrame({ className, onOpenSettings, onMinimize, children }) {
  return (
    <div className={cn('h-full p-1.5', className)}>
      <Surface
        slot="frame"
        className="relative flex h-full flex-col overflow-hidden rounded-[28px] border-4 border-frame-edge bg-frame shadow-lg"
      >
        <TitleBar onOpenSettings={onOpenSettings} onMinimize={onMinimize} />
        <div className="relative flex min-h-0 flex-1 flex-col px-2.5 pb-2.5">{children}</div>
        <ResizeGrip />
      </Surface>
    </div>
  );
}
