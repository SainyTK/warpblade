/** A sprite image with its feet at (ox, oy). */
export interface SpriteImage {
  w: number;
  h: number;
  ox: number;
  oy: number;
  /** image pixels per art pixel: 1 for classic sprites, 2 for detailed ones */
  res: number;
  d: Uint32Array;
}
