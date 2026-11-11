import type { Platform, Point } from "../types/world";

/** The stage is 320 x 180 art pixels, scaled up whole. Game positions are in art pixels. */
export const W = 320;
export const H = 180;
export const N = W * H;
/** The frame is drawn at RES image pixels per art pixel, so sprites and effects can carry half-pixel detail. */
export const RES = 2;
export const FW = W * RES;
export const FH = H * RES;
export const FN = FW * FH;
export const GROUND = 156;
/** the simulation steps at 120 Hz whatever the display rate */
export const STEP = 1 / 120;
/** game seconds that pass in one real second: the whole fight, heroes, foes and effects alike, plays at this pace */
export const PACE = 0.8;
export const MAX_FRAME = 0.05;

export const PLATFORMS: readonly Platform[] = [
  { x0: 36, x1: 112, y: 114 },
  { x0: 208, x1: 284, y: 114 },
  { x0: 128, x1: 192, y: 76 },
];
/** floating warp crystals Kael can hang from */
export const ANCHORS: readonly Point[] = [
  { x: 22, y: 44 },
  { x: 160, y: 28 },
  { x: 298, y: 44 },
];
export const BRAZIERS: readonly Point[] = [
  { x: 46, y: 114 },
  { x: 274, y: 114 },
];
export const MOON: Point & { r: number } = { x: 252, y: 38, r: 15 };
export const SEED = 20261031;
