import { Sprite } from '../../sprites/Sprite';

const PLACEMENT = {
  sun: 'left-4 top-4 size-14',
  cloud: 'left-8 top-7 w-24 animate-drift',
};

export function CelestialBodies({ bodies }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {bodies.map((body) => (
        <Sprite key={body} slot={body} className={`absolute ${PLACEMENT[body]}`} />
      ))}
    </div>
  );
}
