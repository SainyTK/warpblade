/** The image pixels a sprite has drawn in, inclusive; empty when x1 < x0. */
export interface SpriteBox {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/** A sprite image with its feet at (ox, oy). */
export interface SpriteImage {
  w: number;
  h: number;
  ox: number;
  oy: number;
  /** image pixels per art pixel: 1 for classic sprites, 2 for detailed ones */
  res: number;
  d: Uint32Array;
  /** where the sprite has pixels, so a blit can skip the empty rest; absent means anywhere */
  box?: SpriteBox;
}
