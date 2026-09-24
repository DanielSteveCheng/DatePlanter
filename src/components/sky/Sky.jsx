import { Surface } from '../../sprites/Surface';
import { cn } from '../../lib/cn';
import { windFor, windStyle } from '../../lib/weather';
import { CelestialBodies } from './CelestialBodies';
import { Precipitation } from './Precipitation';
import { LightningStrikes } from './LightningStrikes';

const SKY_CLASSES = {
  clear: 'bg-sky-clear',
  snow: 'bg-sky-snow',
  overcast: 'bg-sky-overcast',
};

export function Sky({ scene, children }) {
  return (
    <Surface
      slot={`sky-${scene.sky}`}
      className={cn('relative min-h-0 flex-1 overflow-hidden rounded-t-2xl transition-colors duration-700', SKY_CLASSES[scene.sky])}
      style={windStyle(windFor(scene))}
    >
      {scene.lightning && <LightningStrikes />}
      {scene.precipitation && <Precipitation slot={scene.precipitation} />}
      <CelestialBodies bodies={scene.bodies} />
      {children}
    </Surface>
  );
}
