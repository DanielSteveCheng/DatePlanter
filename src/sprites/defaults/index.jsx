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

export function SnowflakeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <g stroke="var(--color-snow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {[0, 60, 120].map((angle) => (
          <g key={angle} transform={`rotate(${angle} 12 12)`}>
            <path d="M12 2 V22" />
            <path d="M9 4.5 L12 7 L15 4.5 M9 19.5 L12 17 L15 19.5" />
          </g>
        ))}
      </g>
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

export function MiniPot(props) {
  return (
    <svg viewBox="0 0 100 120" {...props}>
      <rect x="46" y="30" width="8" height="30" rx="3" fill="var(--color-stem)" />
      <path d="M50 36 C44 20 26 12 10 16 C16 32 34 40 50 36 Z" fill="var(--color-leaf)" />
      <path d="M50 36 C56 20 74 12 90 16 C84 32 66 40 50 36 Z" fill="var(--color-leaf)" />
      <path d="M46 34 C40 24 28 20 20 21 C26 30 36 34 46 34 Z" fill="var(--color-leaf-selected)" />
      <path d="M54 34 C60 24 72 20 80 21 C74 30 64 34 54 34 Z" fill="var(--color-leaf-selected)" />
      <rect x="20" y="74" width="60" height="42" rx="12" fill="var(--color-pot)" />
      <rect x="10" y="56" width="80" height="26" rx="11" fill="var(--color-pot-rim)" />
      <path
        d="M50 108 C38 100 38 90 45 90 C47.5 90 49 91.5 50 93.5 C51 91.5 52.5 90 55 90 C62 90 62 100 50 108 Z"
        fill="var(--color-pot-heart)"
      />
    </svg>
  );
}

export function Bud(props) {
  return (
    <svg viewBox="0 0 24 32" {...props}>
      <path d="M12 3 C18 9 19 17 12 25 C5 17 6 9 12 3 Z" fill="var(--color-bud)" />
      <path d="M12 31 C6 29 4 23 5 18 C8 22 10 24 12 26 Z" fill="var(--color-leaf)" />
      <path d="M12 31 C18 29 20 23 19 18 C16 22 14 24 12 26 Z" fill="var(--color-leaf)" />
    </svg>
  );
}

export const Leaf = (props) => <LeafShape fill="var(--color-leaf)" {...props} />;
export const LeafSelected = (props) => <LeafShape fill="var(--color-leaf-selected)" {...props} />;

export function ResizeGrip(props) {
  return (
    <svg viewBox="0 0 16 16" {...props}>
      <path d="M15 5 L5 15 M15 10 L10 15" stroke="var(--color-titlebar-text)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TitleIcon({ children, ...props }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" {...props}>
      {children}
    </svg>
  );
}

const GEAR_TEETH = [0, 45, 90, 135, 180, 225, 270, 315];

export const IconSettings = (props) => (
  <TitleIcon {...props}>
    <circle cx="8" cy="8" r="3.9" />
    <circle cx="8" cy="8" r="1.1" fill="currentColor" stroke="none" />
    {GEAR_TEETH.map((angle) => (
      <path key={angle} d="M8 1.6 V3.1" transform={`rotate(${angle} 8 8)`} />
    ))}
  </TitleIcon>
);

export const IconMinimize = (props) => (
  <TitleIcon {...props}>
    <path d="M3.5 8 H12.5" />
  </TitleIcon>
);

export const IconClose = (props) => (
  <TitleIcon {...props}>
    <path d="M4 4 L12 12 M12 4 L4 12" />
  </TitleIcon>
);
