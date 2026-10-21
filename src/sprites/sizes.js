// Every sprite's on-screen size in px (at the default 380×540 window; everything scales with the window).
// A number sets the width and the height follows the art's shape; { width, height } sets both.
export const SPRITE_SIZES = {
  sun: 64,
  cloud: 96,
  'cloud-bolt': 20,
  'cloud-snowflake': 36,
  lightning: 56,
  raindrop: 6,
  snowflake: 6,

  leaf: 64,
  bud: 40,
  'message-bud': { width: 18, height: 24 },
  'message-bubble': 200,

  'mini-pot': { width: 80, height: 96 },
  'loading-spinner': 28,
  'map-pin': { width: 28, height: 36 },

  'title-icon': 14,
  'title-button': 24,
  'resize-grip': 16,
  'scroll-bar': 6,
  'frame-border': 4,
  'frame-radius': 28,
};

// Where one sprite attaches to another, as a fraction of the host sprite's box (0,0 = top-left).
// Adjust if your own mini-pot art puts the sprout somewhere else.
export const SPRITE_ANCHORS = {
  'message-bud-on-pot': { x: 0.5, y: 0.28 },
};

export function spriteSize(name) {
  const size = SPRITE_SIZES[name];
  return typeof size === 'number' ? { width: size } : { width: size.width, height: size.height };
}

export const squareSize = (name) => ({ width: SPRITE_SIZES[name], height: SPRITE_SIZES[name] });
