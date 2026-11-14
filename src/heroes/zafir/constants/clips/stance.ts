import { GUARD_TIMES } from "../../../../constants/combat";
import { frame, POSES, pose } from "../../../../constants/hero";
import type { ActionClip } from "../../../../types/pose";
import { READY } from "./ready";

/** at rest: weight sunk on the back leg, the scimitar laid back across his shoulders, its point trailing behind him, the far hand
 *  on his sash with the elbow out */
const REST = pose({
  hx: -0.5,
  hy: -13.8,
  cb: 0.6,
  nx: 0.5,
  ny: -23.8,
  fx: 2.5,
  fy: -21,
  sa: 2.95,
  bx: -1.5,
  by: -13.5,
  be: 1,
  ffx: 4.5,
  bfx: -3.5,
  ba: 0.15,
});

/** two slow breaths with the hips rocking onto the back leg and the blade tipping on his shoulder */
export const IDLE: ActionClip = {
  dur: frame(48),
  hit: 0,
  keys: [
    [0, REST],
    [frame(12), pose({ ...REST, cb: 0.9, ny: -24.2, fy: -21.4, sa: 2.92 })],
    [frame(24), pose({ ...REST, hx: -0.8, hy: -13.6, ny: -23.6, by: -13.3, sa: 2.98 })],
    [frame(36), pose({ ...REST, cb: 0.8, ny: -24.1, fy: -21.3, sa: 2.94 })],
    [frame(48), REST],
  ],
};

/** hurt and low: hunched over the wound, the scimitar's point down by his front foot, the far hand pressed to his side */
const LOW = pose({
  hx: -1,
  hy: -12.5,
  cb: -1.2,
  nx: 0.5,
  ny: -21.8,
  fx: 7,
  fy: -11.5,
  sa: 1.35,
  bx: 1.5,
  by: -15,
  ffx: 5,
  bfx: -4,
  ba: 0.2,
});

/** the wounded stance his idle sinks into as HP runs low: short, heavy breaths */
export const WOUNDED_IDLE: ActionClip = {
  dur: frame(36),
  hit: 0,
  keys: [
    [0, LOW],
    [frame(8), pose({ ...LOW, hy: -12.2, ny: -21.3, cb: -1.5, fy: -11.2 })],
    [frame(18), LOW],
    [frame(26), pose({ ...LOW, hy: -12.3, ny: -21.5, cb: -1.4, by: -14.6 })],
    [frame(36), LOW],
  ],
};

/** the sand veil: sunk a little, the scimitar raised with its curve outward, the far palm open in front to hold the sand */
const HOLD = {
  hx: -1,
  hy: -12.5,
  cb: 0.5,
  nx: 1.5,
  ny: -22.5,
  fx: 9,
  fy: -18,
  sa: -1.45,
  bx: 6,
  by: -15,
  ffx: 6,
  bfx: -6,
  ba: 0.3,
} as const;
const t = GUARD_TIMES;

/**
 * Zafir's guard in the shared segments: the blade and the palm snapped up; the held veil breathing; the jolt of a block,
 * driven back onto the rear foot; and the parry, a full turn out of the blow that leaves the mirage behind him.
 */
export const GUARD: ActionClip = {
  dur: t.parryEnd,
  hit: 0,
  keys: [
    [0, pose({ hy: -13.5, nx: 1, ny: -23.5, fx: 6, fy: -16, sa: -0.9, bx: 4, by: -15, ffx: 4, bfx: -5 })],
    [t.loopFrom, pose(HOLD), "snap"],
    [frame(16), pose({ ...HOLD, ny: -23, cb: 1, fy: -19.5, by: -17 })],
    [frame(32), pose({ ...HOLD, hy: -12, ny: -22.5, sa: -1.4 })],
    [t.loopTo - 0.001, pose(HOLD)],
    [
      t.block,
      pose({
        ...HOLD,
        hx: -2.5,
        cb: -0.5,
        nx: -0.5,
        ny: -22,
        fx: 7.5,
        fy: -17.5,
        sa: -1.55,
        bx: 4.5,
        bfx: -7,
        ba: 0.6,
      }),
      "snap",
    ],
    [t.block + frame(3), pose({ ...HOLD, hx: -2, nx: 0.5, fx: 8, bx: 5.5, bfx: -7, ba: 0.5 })],
    [t.blockEnd - 0.001, pose(HOLD)],
    [t.parry, pose({ ...HOLD, tw: 1, hx: -2, nx: -1.5, fx: -3, fy: -20, sa: -2.7, bx: 4, by: -18, ffx: 4 }), "snap"],
    [t.parry + frame(2), pose({ ...HOLD, mr: 1, hx: -1, nx: 1, fx: 12, fy: -18, sa: -0.3, bx: -6, by: -17 })],
    [t.parry + frame(4), pose({ ...HOLD, mr: 1, tw: 1, hx: -1.5, nx: -1, fx: -2, fy: -19, sa: 2.9, bx: 3, by: -17 })],
    [t.parry + frame(6), pose({ ...HOLD, fx: 11, fy: -17, sa: 0.1, bx: -6, by: -16, nx: 3 })],
    [t.parryEnd, pose(HOLD)],
  ],
};

/** the front dodge: low and leaning, he turns a full circle on the move with the blade trailing, and rises at the end */
export const DODGE: ActionClip = {
  dur: frame(8),
  hit: 0,
  keys: [
    [0, pose({ ...POSES.dodge, fx: -3, fy: -14, sa: 2.7, bx: -6, by: -15 })],
    [frame(2), pose({ ...POSES.dodge, tw: 1, hy: -10.5, ny: -19.5, fx: 2, fy: -15, sa: 3.0, bx: 4, by: -14 })],
    [frame(4), pose({ ...POSES.dodge, hy: -10.5, ny: -19.5, fx: -4, fy: -13, sa: 2.8, bx: -6, by: -14 })],
    [frame(6), pose({ ...POSES.dodge, hy: -11.5, nx: 5, ny: -21, fx: 1, fy: -14, sa: 2.2, bx: -5, by: -15 })],
    [frame(8), pose({ ...READY, hy: -12.8, ny: -22.8, fx: 4, sa: 1.6 })],
  ],
};

/** the warp throw: the scimitar cocked over his head with the body turned away, then flung out level so it spins away */
export const THROW: ActionClip = {
  dur: 0.15,
  hit: 0.1,
  keys: [
    [0, pose({ hx: -1, cb: -1, nx: -1, ny: -23.5, fx: -2, fy: -26, sa: -2.6, bx: 4, by: -18, ffx: 5, bfx: -5 })],
    [
      frame(2),
      pose({
        tw: 1,
        hx: -1.5,
        cb: -1.5,
        nx: -2,
        ny: -23,
        fx: -4,
        fy: -25,
        sa: -2.9,
        bx: 4,
        by: -19,
        ffx: 5.5,
        bfx: -5,
      }),
    ],
    [frame(3), POSES.throwHold, "snap"],
    [0.15, pose({ ...POSES.throwHold, cb: 0.5, nx: 4.5, fx: 13.5, fy: -21.5, sa: -0.08 })],
  ],
};

const STRIKE = pose({
  hx: 3,
  hy: -12.5,
  cb: 1,
  nx: 6,
  ny: -22,
  fx: 16,
  fy: -17,
  sa: 0.15,
  bx: -8,
  by: -17,
  ffx: 9,
  bfx: -7,
  ba: 0.5,
});
/** the warp's arrival: he lands mid-turn, cuts behind him, comes round and cuts in front, then settles to ready */
export const ARRIVAL: ActionClip = {
  dur: 0.4,
  hit: 0,
  keys: [
    [0, pose({ tw: 1, hx: -1, hy: -12, nx: -2, ny: -22, fx: -3, fy: -18, sa: 3.0, bx: 4, by: -16, ffx: 6, bfx: -5 })],
    [frame(2), pose({ ...STRIKE, mr: 1 }), "snap"],
    [frame(4), STRIKE, "snap"],
    [frame(6), pose({ ...STRIKE, fx: 16.5, fy: -14, sa: 0.6 })],
    [frame(9), pose({ ...READY, hx: 1.5, nx: 3, fx: 11, fy: -14, sa: 0.8, ffx: 7 })],
    [0.4, READY],
  ],
};

const SKYWARD = pose({
  hy: -15,
  nx: 1.5,
  ny: -25.5,
  fx: 2,
  fy: -33,
  sa: -1.45,
  bx: -6,
  by: -24,
  ffx: 5,
  fa: 0.4,
  bfx: -5,
  ba: 0.5,
});
/** Sandstorm let loose: a deep coil, then the scimitar thrust at the sky as he turns a full circle on his toes and the
 *  storm rises round him, then a settle */
export const ULTIMATE: ActionClip = {
  dur: frame(21),
  hit: 0,
  keys: [
    [0, POSES.charge],
    [frame(3), SKYWARD, "snap"],
    [frame(6), pose({ ...SKYWARD, tw: 1, bx: 5 })],
    [frame(9), pose({ ...SKYWARD, mr: 1 })],
    [frame(12), pose({ ...SKYWARD, mr: 1, tw: 1, bx: 5 })],
    [frame(15), pose({ ...SKYWARD, fy: -31, sa: -1.3 })],
    [frame(18), pose({ ...READY, hy: -12.8, fx: 9, fy: -18, sa: 0.2 })],
    [frame(21), READY],
  ],
};
