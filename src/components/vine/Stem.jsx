import { memo, useMemo } from 'react';
import { STEM, stemPoints, toSvgPath } from '../../lib/stem';
import { VINE_LAYOUT } from '../../lib/vine';

export const Stem = memo(function Stem({ fromKnot = -1, toKnot, offsetY }) {
  const path = useMemo(() => toSvgPath(stemPoints(fromKnot, toKnot, VINE_LAYOUT)), [fromKnot, toKnot]);

  return (
    <svg className="pointer-events-none absolute inset-0 size-full overflow-visible">
      <g
        className="transition-transform duration-700 ease-out"
        style={{ transform: `translate(${VINE_LAYOUT.width / 2}px, ${offsetY}px)` }}
      >
        <path
          data-slot="stem"
          d={path}
          fill="none"
          stroke="var(--color-stem)"
          strokeWidth={STEM.width}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
});
