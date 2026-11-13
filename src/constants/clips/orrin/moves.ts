import type { ActionClip, Pose } from "../../../types/pose";
import { frame } from "../../hero";
import { ANCHOR_PIN, WHIRLWALL } from "../../orrin/abilities";
import { ACTION_CLIPS } from "../actions";
import { o, STANCE, TUCK } from "./stance";

/** the hook throw: the arm cocked behind his head for two frames, then thrown up along the aim */
export const HOOK_CLIP: ActionClip = {
  dur: frame(8),
  hit: frame(2),
  keys: [
    [0, STANCE],
    [frame(1), o({ nx: 0, cb: -0.5, fx: -3, fy: -27, fe: 1, sa: -2.6, bx: 6, by: -18 })],
    [frame(2), o({ nx: 0, cb: -0.5, fx: -4, fy: -28, fe: 1, sa: -2.8, bx: 6, by: -18 })],
    [frame(3), o({ nx: 3, cb: 1, ny: -24.5, fx: 10, fy: -30, fe: 0, sa: -0.9, bx: -2, by: -18 }), "snap"],
    [frame(8), o({ nx: 2.5, cb: 0.5, ny: -24.5, fx: 9, fy: -31, sa: -0.9, bx: -2, by: -18 })],
  ],
};

/** the roll after he lets go: one turn of the body in six frames, curled, then open into the fall */
export const ROLL_CLIP: ActionClip = {
  dur: frame(6),
  hit: 0,
  keys: [
    [0, o({ ...TUCK, hy: -15, ny: -24, fx: 3, fy: -30, sa: -1.6, bx: 6, by: -21 })],
    [
      frame(2),
      o({
        ...TUCK,
        hy: -17,
        ny: -20,
        nx: 6,
        cb: 1.5,
        fx: 7,
        fy: -15,
        bx: 4,
        by: -14,
        ffx: -3,
        ffy: -12,
        bfx: -5,
        bfy: -9,
      }),
    ],
    [
      frame(4),
      o({
        ...TUCK,
        hy: -16,
        ny: -21,
        nx: -3,
        cb: 1,
        tw: 1,
        fx: 2,
        fy: -14,
        bx: 3,
        by: -13,
        ffx: 3,
        ffy: -9,
        bfx: 0,
        bfy: -6,
      }),
    ],
    [frame(6), o({ ffx: 3, ffy: -1, bfx: -4, bfy: -3, fx: 8, fy: -19, sa: 0.9, bx: -6, by: -21, nx: 2 })],
  ],
};

/** hauled up a ledge on the chain: stretched out, the chain hand ahead, legs trailing */
export const CLIMB_POSE: Pose = o({
  hx: 0,
  hy: -15,
  nx: 6,
  ny: -23,
  cb: 1,
  fx: 14,
  fy: -22,
  sa: -0.3,
  bx: 4,
  by: -18,
  ffx: -4,
  ffy: -4,
  fa: 0.6,
  bfx: -8,
  bfy: -3,
  ba: 0.6,
});

/** Whirlwall: the chain hand circling over his head while the body walks under it */
export const WHIRL_CLIP: ActionClip = {
  dur: WHIRLWALL.time,
  hit: 0,
  keys: [
    [0, STANCE],
    [frame(3), o({ fx: 3, fy: -33, sa: -1.6, bx: 5, by: -17 })],
    [frame(5), o({ fx: 6, fy: -32, sa: -1.2, bx: 5, by: -17 })],
    [frame(7), o({ fx: 2, fy: -34, sa: -1.8, bx: 5, by: -17 })],
    [frame(9), o({ fx: -2, fy: -32, sa: -2.2, bx: 5, by: -17 })],
    [frame(11), o({ fx: 2, fy: -34, sa: -1.8, bx: 5, by: -17 })],
    [WHIRLWALL.time - frame(3), o({ fx: 3, fy: -33, sa: -1.6, bx: 5, by: -17 })],
    [WHIRLWALL.time, STANCE],
  ],
};

/** Anchor Pin: the hook raised high, then driven down ahead of him into the floor */
export const PIN_CLIP: ActionClip = {
  dur: ANCHOR_PIN.dur,
  hit: ANCHOR_PIN.hit,
  keys: [
    [0, STANCE],
    [frame(4), o({ hy: -14.5, ny: -24.5, nx: 0, cb: -1, fx: 0, fy: -33, sa: -2, bx: 6, by: -19 })],
    [frame(7), o({ hy: -14.5, ny: -24.5, nx: -0.5, cb: -1, fx: -1, fy: -34, sa: -2.2, bx: 6, by: -19 })],
    [
      frame(8),
      o({ hy: -11, ny: -20.5, nx: 5, cb: 1.5, fx: 13, fy: -8, sa: 1.4, bx: -3, by: -16, ffx: 6, bfx: -6, ba: 0.3 }),
      "snap",
    ],
    [frame(11), o({ hy: -11.5, ny: -21, nx: 4.5, cb: 1.5, fx: 12, fy: -8, sa: 1.4, bx: -3, by: -16, ffx: 6, bfx: -6 })],
    [frame(16), STANCE],
  ],
};

/**
 * The warp kick: he lands on the foe heel first, the front leg driven out at its middle with the body thrown back and
 * the chain hand flung behind, holds it a beat, drops onto both feet in a crouch and rises back into his stance.
 */
export const WARP_KICK_CLIP: ActionClip = {
  dur: ACTION_CLIPS.warpStrike.dur,
  hit: 0,
  keys: [
    [0, o({ hy: -16, nx: -1, ny: -26, cb: -1, fx: -5, fy: -23, sa: 2.4, bx: 2, by: -27, ffx: 11, ffy: -12, fa: 0.1 })],
    [
      frame(3),
      o({
        hy: -15.5,
        nx: -1,
        ny: -25.5,
        cb: -1,
        fx: -5,
        fy: -22,
        sa: 2.4,
        bx: 2,
        by: -26,
        ffx: 10,
        ffy: -11,
        fa: 0.1,
        bfx: -3,
        bfy: -5.5,
        ba: 0.6,
      }),
    ],
    [frame(4), o({ ...TUCK, hy: -15, nx: 1, ny: -25, fx: -2, fy: -20, sa: 2, bx: 4, by: -24, ffx: 6, ffy: -5 })],
    [frame(6), o({ hy: -10.5, nx: 3, ny: -20.5, cb: 1.5, fx: 6, fy: -11, sa: 1.4, ffx: 6, bfx: -5, ba: 0.3 }), "snap"],
    [frame(9), o({ hy: -11.5, nx: 2.5, ny: -21.5, cb: 1, fx: 6.5, fy: -12.5, ffx: 5, bfx: -4.5 })],
    [ACTION_CLIPS.warpStrike.dur, STANCE],
  ],
};

/** the deepest of the bend before a jump from a stand: hips drop, knees and back bend, both arms swing down and back to throw up with the push */
export const TAKEOFF_CROUCH: Pose = o({
  hy: -10.6,
  nx: 2.8,
  ny: -20.6,
  cb: 1.4,
  fx: 4.5,
  fy: -9.5,
  sa: 1.6,
  bx: -0.5,
  by: -13,
  ffx: 4.5,
  bfx: -4.5,
  ba: 0.35,
});
