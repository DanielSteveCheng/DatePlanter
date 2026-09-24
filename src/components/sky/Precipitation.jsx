import { Sprite } from '../../sprites/Sprite';

const PARTICLE_COUNT = 24;

const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  delay: `${((i * 0.29) % 1).toFixed(2)}s`,
  duration: `${0.7 + ((i * 0.13) % 0.5)}s`,
}));

export function Precipitation({ slot }) {
  const slow = slot === 'snowflake';
  return (
    <div className="pointer-events-none absolute inset-0 top-12">
      {particles.map((particle, i) => (
        <Sprite
          key={i}
          slot={slot}
          className="absolute top-0 w-1.5 animate-fall"
          style={{
            left: particle.left,
            animationDelay: particle.delay,
            animationDuration: slow ? `calc(${particle.duration} * 4)` : particle.duration,
          }}
        />
      ))}
    </div>
  );
}
