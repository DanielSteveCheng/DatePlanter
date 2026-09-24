import { Surface } from '../../sprites/Surface';
import { cn } from '../../lib/cn';
import { CelestialBodies } from './CelestialBodies';
import { Precipitation } from './Precipitation';
import { LightningFlash } from './LightningFlash';

const SKY_CLASSES = {
  clear: 'bg-sky-clear',
  overcast: 'bg-sky-overcast',
};

export function Sky({ scene, children }) {
  return (
    <Surface
      slot={`sky-${scene.sky}`}
      className={cn('relative min-h-0 flex-1 overflow-hidden rounded-t-2xl transition-colors duration-700', SKY_CLASSES[scene.sky])}
    >
      {scene.lightning && <LightningFlash />}
      <CelestialBodies bodies={scene.bodies} />
      {scene.precipitation && <Precipitation slot={scene.precipitation} />}
      {children}
    </Surface>
  );
}
