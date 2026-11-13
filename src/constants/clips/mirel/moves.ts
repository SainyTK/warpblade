import type { ActionClip, Pose } from "../../../types/pose";
import { frame } from "../../hero";
import { SECOND_HAND, STOPPED_CLOCK } from "../../mirel/abilities";
import { REWIND } from "../../mirel/rewind";
import { CHARGE_POSE, HANG_LEGS, m, STANCE } from "./stance";

/** I with the Stillfield: the staff held out ahead, ring forward and bright, as the field opens */
export const STILL_CAST: ActionClip = {
  dur: 0.2,
  hit: 0,
  keys: [
    [0, STANCE],
    [frame(2), m({ nx: 2, cb: 0.6, fx: 11, fy: -20, sa: -0.6, bx: 6, by: -19, be: 0, ffx: 5, bfx: -3 })],
    [frame(6), m({ nx: 1.8, cb: 0.5, fx: 10.5, fy: -20, sa: -0.62, bx: 6, by: -19, be: 0, ffx: 5, bfx: -3 })],
  ],
};

/** the middle of a rewind: leaning back, the staff swung up and behind her, legs trailing forward */
const REWIND_LEAN = m({
  hx: 0.5,
  hy: -14.5,
  nx: -2,
  ny: -23.5,
  cb: -1.2,
  fx: 2,
  fy: -25,
  sa: -2.1,
  bx: 6,
  by: -18,
  be: 0,
  ffx: 4,
  ffy: -2,
  fa: 0.3,
  bfx: 0,
  bfy: -1,
  ba: 0.2,
});

/** Second Chance, over its rewind's playback: a dip back against the pull, the lean with the staff swung up behind her and her legs
 *  trailing forward, then the knees bending under her for the stop */
export const REWIND_CLIP: ActionClip = {
  dur: REWIND.play,
  hit: 0,
  keys: [
    [
      0,
      m({
        hy: -12.8,
        nx: -1,
        ny: -22.8,
        cb: -0.6,
        fx: 3.5,
        fy: -20,
        sa: -1.85,
        bx: 5,
        by: -15,
        be: 0,
        ffx: 4,
        bfx: -2.5,
      }),
    ],
    [frame(2), REWIND_LEAN],
    [frame(4), { ...REWIND_LEAN, nx: -2.4, cb: -1.4, fx: 1.5, fy: -25.5, sa: -2.2 }],
    [
      frame(6),
      m({
        hy: -13.6,
        nx: -0.6,
        ny: -23.4,
        cb: -0.5,
        fx: 4.5,
        fy: -19,
        sa: -1.7,
        bx: 5,
        by: -15,
        be: 0,
        ffx: 3.5,
        ffy: -1,
      }),
    ],
    [REWIND.play, m({ hy: -12.8, nx: 0.8, ny: -22.8, cb: 0.3, fx: 6.3, fy: -15.2, sa: -1.45, by: -12.5 })],
  ],
};

/** Stopped Clock: the staff pulled back, then thrust out ahead and up at the foe, the far hand open beside it */
export const CLOCK_CLIP: ActionClip = {
  dur: STOPPED_CLOCK.dur,
  hit: STOPPED_CLOCK.hit,
  keys: [
    [0, STANCE],
    [frame(2), m({ nx: -0.5, cb: -0.5, fx: 3, fy: -21, sa: -1.9, bx: 2, by: -17 })],
    [frame(4), m({ nx: -1, cb: -0.8, fx: 1, fy: -22, sa: -2.1, bx: 1, by: -17 })],
    [frame(6), m({ nx: 2.5, cb: 1, fx: 11, fy: -21, sa: -0.45, bx: 9, by: -19, be: 0, ffx: 5, bfx: -4 }), "snap"],
    [frame(9), m({ nx: 2.2, cb: 0.8, fx: 10.5, fy: -20.5, sa: -0.5, bx: 8, by: -18.5, ffx: 5, bfx: -4 })],
    [frame(12), STANCE],
  ],
};

/** Second Hand: a quick flick of the staff level ahead at chest height */
export const HAND_CLIP: ActionClip = {
  dur: SECOND_HAND.dur,
  hit: SECOND_HAND.hit,
  keys: [
    [0, STANCE],
    [frame(2), m({ nx: 0, fx: 4, fy: -19, sa: -1.1, bx: 2, by: -16 })],
    [frame(4), m({ nx: 2.5, cb: 0.8, fx: 11, fy: -18, sa: -0.05, bx: 5, by: -17, be: 0, ffx: 5, bfx: -3 }), "snap"],
    [frame(7), m({ nx: 2, cb: 0.6, fx: 10, fy: -18, sa: -0.15, bx: 5, by: -17, ffx: 5, bfx: -3 })],
    [frame(10), STANCE],
  ],
};

/** a spell: the staff raised overhead, then brought forward as the spell leaves the ring */
export const SPELL_CLIP: ActionClip = {
  dur: frame(12),
  hit: frame(5),
  keys: [
    [0, STANCE],
    [frame(3), m({ ny: -24.6, cb: -0.5, fx: 5, fy: -27, sa: -1.6, bx: 3, by: -24, be: 1 })],
    [frame(5), m({ nx: 2, cb: 0.6, fx: 10, fy: -22, sa: -0.8, bx: 6, by: -19, be: 0, ffx: 5, bfx: -3 }), "snap"],
    [frame(8), m({ nx: 1.8, cb: 0.5, fx: 9.5, fy: -21, sa: -0.85, bx: 6, by: -18.5, ffx: 5, bfx: -3 })],
    [frame(12), STANCE],
  ],
};

/** the special: the staff raised overhead, then planted as the clock face opens */
export const HOUR_CLIP: ActionClip = {
  dur: frame(14),
  hit: frame(6),
  keys: [
    [0, CHARGE_POSE],
    [frame(5), { ...CHARGE_POSE, ny: -25, fy: -31, by: -29 }],
    [
      frame(6),
      m({ hy: -12, ny: -22, nx: 2, cb: 1, fx: 9, fy: -12, sa: -1.4, bx: 7, by: -14, be: 0, ffx: 6, bfx: -5 }),
      "snap",
    ],
    [
      frame(10),
      m({ hy: -12.5, ny: -22.5, nx: 1.8, cb: 0.8, fx: 9, fy: -12.5, sa: -1.42, bx: 7, by: -14.5, ffx: 6, bfx: -5 }),
    ],
    [frame(14), STANCE],
  ],
};

/** in the air the casts keep her legs together */
export const airborne = (p: Pose): Pose => ({ ...p, ...HANG_LEGS });
