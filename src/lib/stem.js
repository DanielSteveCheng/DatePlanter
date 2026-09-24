export const STEM = {
  seed: 7,
  width: 8,
  bend: 10,
  minBend: 0.35,
  twistChance: 0.3,
  twistRadius: 10,
  twistSteps: 28,
  step: 4,
};

export function noise(index, salt, seed = STEM.seed) {
  let h = Math.imul(index ^ seed, 0x9e3779b1) ^ Math.imul(salt + 1, 0x85ebca6b);
  h ^= h >>> 16;
  h = Math.imul(h, 0x7feb352d);
  h ^= h >>> 15;
  h = Math.imul(h, 0x846ca68b);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

const sideSign = (k) => (Math.abs(k) % 2 === 0 ? 1 : -1);

export const knotY = (k, layout) => layout.topOffset + layout.attachY + k * layout.spacing;

export function knotX(k, stem = STEM) {
  const strength = stem.minBend + (1 - stem.minBend) * noise(k, 1, stem.seed);
  return sideSign(k) * stem.bend * strength;
}

export function isTwist(k, stem = STEM) {
  const rolls = (i) => i >= 0 && noise(i, 3, stem.seed) < stem.twistChance;
  return rolls(k) && !rolls(k - 1);
}

const ease = (t) => (1 - Math.cos(Math.PI * t)) / 2;

function pointOnSegment(k, t, layout, stem) {
  const from = knotX(k, stem);
  const to = knotX(k + 1, stem);
  const x = from + (to - from) * ease(t);
  const y = knotY(k, layout) + t * layout.spacing;
  const slope = ((to - from) * (Math.PI / 2) * Math.sin(Math.PI * t)) / layout.spacing;
  return { x, y, slope };
}

export function twistPoints({ x, y, slope }, side, stem = STEM) {
  const length = Math.hypot(slope, 1);
  const tangent = { x: slope / length, y: 1 / length };
  const normal = { x: side * tangent.y, y: -side * tangent.x };
  const r = stem.twistRadius;
  const center = { x: x + r * normal.x, y: y + r * normal.y };
  return Array.from({ length: stem.twistSteps + 1 }, (_, i) => {
    const angle = (2 * Math.PI * i) / stem.twistSteps;
    return {
      x: center.x + r * (-normal.x * Math.cos(angle) + tangent.x * Math.sin(angle)),
      y: center.y + r * (-normal.y * Math.cos(angle) + tangent.y * Math.sin(angle)),
    };
  });
}

export function stemPoints(fromKnot, toKnot, layout, stem = STEM) {
  const samples = 2 * Math.ceil(layout.spacing / (2 * stem.step));
  const points = [];
  for (let k = fromKnot; k < toKnot; k++) {
    for (let s = 0; s < samples; s++) {
      const point = pointOnSegment(k, s / samples, layout, stem);
      points.push(point);
      if (s === samples / 2 && isTwist(k, stem)) {
        const side = noise(k, 4, stem.seed) < 0.5 ? 1 : -1;
        points.push(...twistPoints(point, side, stem));
      }
    }
  }
  points.push({ x: knotX(toKnot, stem), y: knotY(toKnot, layout) });
  return points;
}

const round = (n) => Math.round(n * 10) / 10;

export const toSvgPath = (points) => `M${points.map((p) => `${round(p.x)} ${round(p.y)}`).join(' L')}`;
