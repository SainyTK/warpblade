import type { Pose } from '@game/types/pose';

/** A pixel buffer of 0xRRGGBB colors, 0 for empty, with `res` image pixels to an art pixel each way. */
export interface Raster {
  w: number;
  h: number;
  res: number;
  d: Uint32Array;
}

/** A point in art pixels. */
export type Point = readonly [number, number];

/** A clip's frames as edited in the studio: one pose per frame, and the frames the game jumps to. */
export interface ClipFrames {
  frames: readonly Pose[];
  snaps: readonly number[];
}

/** Kael at one frame: the pose and where the scarf and ponytail swing, in art pixels from his feet. */
export interface HeroLayer {
  pose: Pose;
  ropes: { scarf: Point[]; tail: Point[] };
}

export type SaveStatus = 'saved' | 'saving' | 'failed' | 'reloaded';

/** Where a clip changed outside this page: the game's clip file or the studio's draft. */
export type ClipSource = 'game' | 'draft';
