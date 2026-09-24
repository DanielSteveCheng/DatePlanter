import { useMemo } from 'react';
import { Sprite } from '../../sprites/Sprite';
import { PRECIPITATION, layoutParticles, randomLeftPercent } from '../../lib/precipitation';

const respawnInNewColumn = (event) => {
  event.currentTarget.style.left = `${randomLeftPercent()}%`;
};

export function Precipitation({ slot }) {
  const config = PRECIPITATION[slot];
  const particles = useMemo(() => layoutParticles(config), [config]);

  return (
    <div className="pointer-events-none absolute inset-0 @container-size">
      {particles.map((particle, i) => (
        <Sprite
          key={i}
          slot={slot}
          className="absolute top-0 animate-fall"
          onAnimationIteration={respawnInNewColumn}
          style={{
            left: `${particle.leftPercent}%`,
            width: particle.size,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            '--fall-spawn-y': `${config.spawnY}px`,
            '--fall-drift-x': `${particle.driftX}px`,
          }}
        />
      ))}
    </div>
  );
}
