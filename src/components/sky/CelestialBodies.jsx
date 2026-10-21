import { Sprite } from '../../sprites/Sprite';
import { cn } from '../../lib/cn';
import { spriteSize, squareSize } from '../../sprites/sizes';

const ANCHOR = 'left-4 top-4';

const LAYOUTS = {
  solo: {
    sun: { position: 'inset-0' },
    cloud: { position: 'left-9.5 top-10 -translate-x-[52%] -translate-y-1/2' },
  },
  storm: {
    cloud: { position: 'left-9.5 top-7 -translate-x-[52%] -translate-y-1/2' },
    'cloud-bolt': { position: 'left-9.5 top-9 -translate-x-1/2' },
    'cloud-snowflake': { position: 'left-9.5 top-9 -translate-x-1/2', animation: 'animate-twirl' },
  },
  paired: {
    sun: { position: 'inset-0' },
    cloud: { position: 'left-4 top-5', animation: 'animate-drift' },
  },
};

function layoutFor(bodies) {
  if (bodies.includes('cloud-bolt') || bodies.includes('cloud-snowflake')) return LAYOUTS.storm;
  if (bodies.includes('sun') && bodies.includes('cloud')) return LAYOUTS.paired;
  return LAYOUTS.solo;
}

export function CelestialBodies({ bodies }) {
  const layout = layoutFor(bodies);
  return (
    <div className={cn('pointer-events-none absolute', ANCHOR)} style={squareSize('sun')}>
      {bodies.map((body) => (
        <div
          key={body}
          className={cn('absolute transition-[left,top,translate] duration-700', layout[body].position)}
          style={body === 'sun' ? undefined : spriteSize(body)}
        >
          <Sprite slot={body} className={cn('block w-full', layout[body].animation)} />
        </div>
      ))}
    </div>
  );
}
