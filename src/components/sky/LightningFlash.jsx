import { Sprite } from '../../sprites/Sprite';

export function LightningFlash() {
  return (
    <div className="pointer-events-none absolute inset-0 animate-flash bg-white/40">
      <Sprite slot="lightning" className="absolute left-16 top-14 w-6" />
    </div>
  );
}
