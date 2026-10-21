// Background cloud layers, farthest first. Sizes in px; heights as % of the sky; seconds per crossing.
export const BACKDROP_CLOUDS = [
  { count: 4, size: 52, top: [4, 30], seconds: 95, opacity: 0.35 },
  { count: 3, size: 78, top: [12, 48], seconds: 65, opacity: 0.55 },
  { count: 2, size: 112, top: [42, 70], seconds: 42, opacity: 0.8 },
];

export const BACKDROP_JITTER = { size: 0.15, speed: 0.15, spacing: 0.6 };

const between = (min, max, random) => min + random() * (max - min);
const vary = (value, amount, random) => value * between(1 - amount, 1 + amount, random);

export function layoutBackdropClouds(layers = BACKDROP_CLOUDS, random = Math.random, jitter = BACKDROP_JITTER) {
  return layers.flatMap((layer, depth) =>
    Array.from({ length: layer.count }, (_, i) => {
      const seconds = vary(layer.seconds, jitter.speed, random);
      const progress = (i + random() * jitter.spacing) / layer.count;
      return {
        id: `${depth}-${i}`,
        depth,
        width: Math.round(vary(layer.size, jitter.size, random)),
        topPercent: between(layer.top[0], layer.top[1], random),
        seconds,
        delay: -progress * seconds,
        opacity: layer.opacity,
        flipped: random() < 0.5,
      };
    }),
  );
}
