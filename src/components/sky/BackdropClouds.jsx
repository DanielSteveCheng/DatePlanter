import { useMemo } from 'react';
import { Sprite } from '../../sprites/Sprite';
import { layoutBackdropClouds } from '../../lib/backdrop';
import { cn } from '../../lib/cn';

export function BackdropClouds() {
  const clouds = useMemo(() => layoutBackdropClouds(), []);

  return (
    <div data-slot="backdrop" className="pointer-events-none absolute inset-0 overflow-hidden @container">
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="absolute left-0 animate-cross-sky"
          style={{
            top: `${cloud.topPercent}%`,
            width: cloud.width,
            opacity: cloud.opacity,
            animationDuration: `${cloud.seconds}s`,
            animationDelay: `${cloud.delay}s`,
          }}
        >
          <Sprite slot="backdrop-cloud" className={cn('block w-full', cloud.flipped && '-scale-x-100')} />
        </div>
      ))}
    </div>
  );
}
