import type { ActionClip, Pose } from "../../../types/pose";
import { frame } from "../../hero";
import { GUARD, g } from "./stance";

/** no change to any joint */
const STILL: Pose = {
  hx: 0,
  hy: 0,
  cb: 0,
  nx: 0,
  ny: 0,
  fx: 0,
  fy: 0,
  fe: 0,
  bx: 0,
  by: 0,
  be: 0,
  ffx: 0,
  ffy: 0,
  fa: 0,
  bfx: 0,
  bfy: 0,
  ba: 0,
  sa: 0,
  tw: 0,
  mr: 0,
  dr: 0,
  ah: 0,
};

/** a change added to some joints of whatever pose she is in; positive y is down */
const nudge = (o: Partial<Pose>): Pose => ({ ...STILL, ...o });

/**
 * Recoveries her pose layer adds over her free states and actions, keyed every two frames and ending on no change.
 * `start` is sampled by the time she has been pushed from a stand, the others from the moment they begin.
 */
export const SETTLE_NUDGES = {
  /** the weight rocks back and sinks while the walk loads, then the body tips into the first stride */
  start: {
    dur: frame(9),
    hit: 0,
    keys: [
      [0, STILL],
      [frame(2), nudge({ hx: -0.5, hy: 0.8, nx: -0.7, ny: 0.7, cb: -0.3, fy: 0.5, by: 0.5 })],
      [frame(3), nudge({ hx: -0.5, hy: 0.9, nx: -0.8, ny: 0.8, cb: -0.3, fy: 0.6, by: 0.6 })],
      [frame(5), nudge({ hx: 0.3, hy: 0.4, nx: 1, ny: 0.3, cb: 0.4, fx: 0.5, bx: 0.3 })],
      [frame(7), nudge({ nx: 0.6, ny: 0.1, cb: 0.2 })],
      [frame(9), STILL],
    ],
  },
  /** her weight carries on past her planted feet, sinks, and rocks back before she settles in her guard */
  stop: {
    dur: frame(10),
    hit: 0,
    keys: [
      [0, nudge({ hx: 0.5, hy: 0.5, nx: 1, ny: 0.5, cb: 0.3 })],
      [frame(2), nudge({ hx: 0.6, hy: 0.9, nx: 1.4, ny: 0.9, cb: 0.5, fx: 0.6, bx: 0.4, fy: 0.4, by: 0.4 })],
      [frame(4), nudge({ hx: 0.2, hy: 0.6, nx: 0.4, ny: 0.5, cb: 0.1, fy: 0.2, by: 0.2 })],
      [frame(6), nudge({ hx: -0.3, hy: 0.2, nx: -0.5, ny: 0.1, cb: -0.2 })],
      [frame(8), nudge({ nx: -0.2 })],
      [frame(10), STILL],
    ],
  },
  /** she dips through a turn on the floor as her weight swings to the other foot */
  turn: {
    dur: frame(6),
    hit: 0,
    keys: [
      [0, nudge({ hy: 0.8, ny: 1, nx: -0.5 })],
      [frame(2), nudge({ hy: 1, ny: 1.2, nx: -0.3, fy: 0.5, by: 0.5 })],
      [frame(4), nudge({ hy: 0.4, ny: 0.5 })],
      [frame(6), STILL],
    ],
  },
  /** a plate breaks: the blow shoves her shoulders back and her knees give, then she squares up again */
  flinch: {
    dur: frame(8),
    hit: 0,
    keys: [
      [0, nudge({ hx: -0.8, hy: 0.5, nx: -2, ny: 0.5, cb: -1, fx: -1.5, fy: 1, bx: -1, by: 1 })],
      [frame(2), nudge({ hx: -0.8, hy: 0.8, nx: -2.2, ny: 0.9, cb: -1.2, fx: -1.6, fy: 1.2, bx: -1.2, by: 1 })],
      [frame(4), nudge({ hx: -0.4, hy: 0.5, nx: -1.2, ny: 0.5, cb: -0.6, fx: -0.8, fy: 0.5, bx: -0.6, by: 0.5 })],
      [frame(6), nudge({ hy: 0.2, nx: -0.4, ny: 0.2 })],
      [frame(8), STILL],
    ],
  },
} satisfies Record<string, ActionClip>;

/** the deepest of her jump's load from a stand: she sinks into her knees with the fists dropping, the body coiled over
 *  the front foot */
export const JUMP_CROUCH: Pose = g({
  hx: 0.2,
  hy: -10.2,
  nx: 2.8,
  ny: -20.2,
  cb: 1,
  fx: 6.5,
  fy: -15.5,
  bx: 4,
  by: -16.5,
  ffx: 5.5,
  bfx: -5.5,
  ba: 0.3,
});

/**
 * Her landing from a full fall: the knees fold deep under her weight with the fists dropped to her chest, hold, and
 * push her back up into her guard.
 */
export const HULDA_LAND: ActionClip = {
  dur: frame(10),
  hit: 0,
  keys: [
    [0, g({ hy: -11, nx: 2.5, ny: -21, cb: 0.8, fx: 7.5, fy: -16, bx: 5, by: -17, ffx: 5.5, bfx: -5.5 })],
    [
      frame(2),
      g({ hx: 0.3, hy: -9.5, nx: 3, ny: -19.4, cb: 1.2, fx: 7.5, fy: -14, bx: 5, by: -15, ffx: 6, bfx: -6, ba: 0.2 }),
    ],
    [
      frame(4),
      g({
        hx: 0.3,
        hy: -9.7,
        nx: 2.8,
        ny: -19.6,
        cb: 1.1,
        fx: 7.5,
        fy: -14.5,
        bx: 5,
        by: -15.5,
        ffx: 6,
        bfx: -6,
        ba: 0.2,
      }),
    ],
    [frame(6), g({ hy: -11, nx: 2.2, ny: -21, cb: 0.8, fx: 7.2, fy: -17, bx: 5, by: -18, ffx: 5.5, bfx: -5.5 })],
    [frame(8), g({ hy: -12.2, nx: 1.7, ny: -22.2, fy: -18.6, by: -19.7 })],
    [frame(10), GUARD],
  ],
};
