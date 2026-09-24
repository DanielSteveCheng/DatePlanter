import { Sprite } from '../../sprites/Sprite';
import { useLightningStrikes } from '../../hooks/useLightningStrikes';
import { LIGHTNING } from '../../lib/lightning';
import { cn } from '../../lib/cn';

export function LightningStrikes() {
  const strike = useLightningStrikes();
  if (!strike) return null;

  return (
    <div
      key={strike.id}
      className="pointer-events-none absolute inset-0 animate-strike"
      style={{ animationDuration: `${LIGHTNING.durationMs}ms` }}
    >
      <div className="absolute inset-0 bg-lightning-flash" />
      <Sprite
        slot="lightning"
        className={cn('absolute top-0 w-14', strike.flipped && '-scale-x-100')}
        style={{ left: `${strike.leftPercent}%` }}
      />
    </div>
  );
}
