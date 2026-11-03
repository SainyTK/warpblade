// A studio sketch: Kael's keyed motion and a hand-drawn effect, saved by the server as JSON.
import type { Pose } from '../../src/types/pose';

/** One snapshot of the rig, placed on the timeline in animation frames (30 a second, the game's ANIM_FPS). */
export interface MotionKey {
  id: string;
  frame: number;
  pose: Pose;
  /** Where Kael's feet are, in art pixels from where the motion starts: x forward, negative y up. */
  root: { x: number; y: number };
  /** Hold the previous key and jump to this one, as the game's "snap" keyframes do. */
  snap: boolean;
}

/** A drawn effect frame: pixels in art pixels from Kael's feet (x right, y down, as poses are), shown from `frame` for `hold` frames. */
export interface EffectCel {
  id: string;
  frame: number;
  hold: number;
  /** "x,y" to a 0xRRGGBB color. */
  pixels: Record<string, number>;
}

export interface Sketch {
  id: string;
  name: string;
  updatedAt: string;
  motion: {
    keys: MotionKey[];
    /** The frame the blow lands or the spell leaves the hand, or null when the motion has no hit. */
    hitFrame: number | null;
  };
  effect: { cels: EffectCel[] };
}

export interface SketchSummary {
  id: string;
  name: string;
  updatedAt: string;
}
