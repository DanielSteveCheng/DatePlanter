export function Sun(props) {
  return (
    <svg viewBox="0 0 64 64" {...props}>
      <circle cx="32" cy="32" r="28" fill="var(--color-sun)" />
    </svg>
  );
}

export function Cloud(props) {
  return (
    <svg viewBox="0 0 120 64" {...props}>
      <g fill="var(--color-cloud)">
        <circle cx="38" cy="36" r="22" />
        <circle cx="66" cy="26" r="24" />
        <circle cx="90" cy="40" r="18" />
        <rect x="20" y="38" width="86" height="20" rx="10" />
      </g>
    </svg>
  );
}

export function Raindrop(props) {
  return (
    <svg viewBox="0 0 8 16" {...props}>
      <path d="M4 0 C6 6 8 9 8 12 A4 4 0 0 1 0 12 C0 9 2 6 4 0 Z" fill="var(--color-rain)" />
    </svg>
  );
}

export function Snowflake(props) {
  return (
    <svg viewBox="0 0 10 10" {...props}>
      <circle cx="5" cy="5" r="4" fill="var(--color-snow)" />
    </svg>
  );
}

export function Lightning(props) {
  return (
    <svg viewBox="0 0 32 64" {...props}>
      <path d="M20 0 L4 36 H16 L10 64 L30 24 H18 L26 0 Z" fill="var(--color-lightning)" />
    </svg>
  );
}

function LeafShape({ fill, ...props }) {
  return (
    <svg viewBox="0 0 64 40" {...props}>
      <path d="M2 20 C14 2 44 0 62 8 C48 30 20 38 2 20 Z" fill={fill} />
      <path d="M4 20 Q30 16 58 9" stroke="var(--color-leaf-vein)" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export const Leaf = (props) => <LeafShape fill="var(--color-leaf)" {...props} />;
export const LeafSprout = (props) => <LeafShape fill="var(--color-leaf-sprout)" {...props} />;
export const LeafSelected = (props) => <LeafShape fill="var(--color-leaf-selected)" {...props} />;
