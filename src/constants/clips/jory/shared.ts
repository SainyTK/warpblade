import type { ActionClip, Pose } from "../../../types/pose";
import { GUARD_TIMES } from "../../combat";
import { frame } from "../../hero";
import { ACTION_CLIPS } from "../actions";
import { CRASH_LOW } from "./mallets";
import { RIDE_UP, s } from "./stance";

/**
 * His guard held: sunk on wide feet, the war drum swung up in front of his belly with its head to the foe like a shield,
 * the far hand braced on its rim, the near mallet raised over his shoulder for the answer.
 */
const HOLD: Pose = s({
  hx: -1,
  hy: -11.8,
  nx: 1.4,
  ny: -21.8,
  cb: 1,
  fx: 4.2,
  fy: -24.5,
  sa: -1.65,
  bx: 5,
  by: -13.6,
  be: 0,
  ffx: 5.6,
  bfx: -5.8,
  ba: 0.3,
  dr: 0.15,
});

/** the block: driven back onto the rear foot, the drum jolted toward him */
const JOLT: Pose = { ...HOLD, hx: -2.4, cb: 0.3, nx: 0, ny: -21.6, bx: 3.8, by: -13.4, bfx: -7, ba: 0.6, dr: 0.1 };

/** Counterbeat: both palms slam the drum head as the parried blow rings off it */
const COUNTER: Pose = s({
  hy: -12.2,
  ny: -22.4,
  nx: 2.2,
  cb: 1.2,
  fx: 8,
  fy: -14,
  sa: -1.3,
  bx: 7.2,
  by: -13.8,
  be: 0,
  ffx: 6,
  bfx: -5.6,
  dr: 1,
});

const t = GUARD_TIMES;

/** his guard in the shared segments: the drum snapped up, held and breathing, the block's jolt, and Counterbeat */
export const JORY_GUARD_CLIP: ActionClip = {
  dur: t.parryEnd,
  hit: 0,
  keys: [
    [0, s({ hy: -13, fx: 4, fy: -21, sa: -1.6, bx: 4, by: -14.5, be: 0, dr: 0.1 })],
    [t.loopFrom, HOLD, "snap"],
    [frame(16), { ...HOLD, hy: -12, ny: -22, cb: 0.8 }],
    [frame(32), { ...HOLD, hy: -12.4, fy: -23.8 }],
    [t.loopTo - 0.001, HOLD],
    [t.block, JOLT, "snap"],
    [t.block + frame(3), { ...JOLT, hx: -1.8, nx: 0, bfx: -6.6 }],
    [t.blockEnd - 0.001, HOLD],
    [t.parry, COUNTER, "snap"],
    [t.parry + frame(3), { ...COUNTER, hy: -11.8, fy: -13.4, by: -13.2 }],
    [
      t.parry + frame(8),
      s({ hy: -12.4, nx: 1.4, cb: 0.9, fx: 5, fy: -20, sa: -1.8, bx: 6.6, by: -15, be: 0, dr: 0.6 }),
    ],
    [t.parryEnd, HOLD],
  ],
};

/** his warp's throw: the near mallet drawn back over his shoulder, the far fist aimed, then the mallet flung out flat */
export const JORY_THROW: ActionClip = {
  dur: ACTION_CLIPS.throw.dur,
  hit: ACTION_CLIPS.throw.hit,
  keys: [
    [0, RIDE_UP],
    [frame(1), s({ hx: -0.6, cb: -0.8, nx: 0, fx: -1, fy: -22.5, sa: -1.9, bx: 4, by: -18, be: 0 })],
    [
      frame(2),
      s({ hx: -1, cb: -1.4, nx: -0.8, fx: -5.5, fy: -26.5, sa: -2.6, bx: 5.5, by: -20, be: 0, ba: 0.3, bfx: -5 }),
    ],
    [
      ACTION_CLIPS.throw.hit,
      s({ hx: 0.4, cb: 1, nx: 2.6, ny: -23, fx: 11, fy: -19.5, sa: -0.15, ffx: 5.5, bfx: -4.4 }),
      "snap",
    ],
    [ACTION_CLIPS.throw.dur, s({ hx: 0.4, cb: 1, nx: 2.6, ny: -23, fx: 11, fy: -19.5, sa: -0.15, ffx: 5.5 })],
  ],
};

/** his warp's arrival: down out of the flight straight into Crash's strike on the drum, then up into the ride */
export const JORY_WARP_STRIKE: ActionClip = {
  dur: ACTION_CLIPS.warpStrike.dur,
  hit: 0,
  keys: [
    [0, CRASH_LOW, "snap"],
    [frame(2), { ...CRASH_LOW, hy: -9.2, fy: -11, by: -11.3 }],
    [frame(6), { ...CRASH_LOW, hy: -9.8, ny: -19.6, fy: -11.8 }],
    [frame(9), s({ hy: -12, ny: -22, nx: 2, cb: 0.9, fx: 7.5, fy: -15.5, sa: -0.4, bx: 6, by: -15, be: 0, dr: 0.6 })],
    [frame(12), RIDE_UP],
  ],
};
