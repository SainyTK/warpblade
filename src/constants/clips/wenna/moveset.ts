import type { ActionClip, PoseKeyframe } from "../../../types/pose";
import { CLIPS, STATE_CLIPS } from "../../clips";
import { GUARD_TIMES } from "../../combat";
import { frame } from "../../hero";
import { LAMP_CLIPS } from "./lamp";
import { m, STANCE } from "./stance";

/** the candle just let go: the far hand flung out ahead and high, the pole held upright at her side, weight forward */
const THROWN = m({
  hx: 1,
  hy: -13.6,
  cb: 0.8,
  nx: 3.2,
  ny: -23.4,
  fx: 4.5,
  fy: -17,
  sa: -1.5,
  bx: 12,
  by: -21,
  be: 0,
  ffx: 5,
  bfx: -4,
  ba: 0.35,
});

/**
 * J held, the throw: the far hand draws a candle back low behind her and up past her shoulder as she hunches over the
 * pole, then flings it out ahead on the release frame and holds there. Its length and release are the shared throw's.
 */
export const WENNA_THROW: ActionClip = {
  dur: CLIPS.throw.dur,
  hit: CLIPS.throw.hit,
  keys: [
    [0, STANCE],
    [frame(1), m({ hx: -0.5, cb: -0.6, nx: 0.2, ny: -23.6, fx: 5, bx: -6.5, by: -16, be: 0, ffx: 3.5, bfx: -3.5 })],
    [
      frame(2),
      m({ hx: -1, hy: -13.6, cb: -1, nx: -0.6, ny: -23.4, fx: 5, bx: -9, by: -23.5, be: 0, ffx: 4, bfx: -4.5 }),
    ],
    [CLIPS.throw.hit, THROWN, "snap"],
    [CLIPS.throw.dur, { ...THROWN, bx: 11.5, by: -20.6 }],
  ],
};

/** waiting on the candle's flight: the far hand still pointing after it, easing down a little, the pole steady */
export const WENNA_THROW_WAIT: ActionClip = {
  dur: STATE_CLIPS.throwWait.dur,
  hit: 0,
  keys: [
    [0, THROWN],
    [frame(4), { ...THROWN, cb: 0.6, nx: 2.8, bx: 11, by: -20 }],
    [STATE_CLIPS.throwWait.dur, { ...THROWN, cb: 0.6, nx: 2.8, bx: 11, by: -20 }],
  ],
};

/** the Flare's frames from its blow to its end, stretched over the shared arrival's length */
function flareFromHit(dur: number): PoseKeyframe[] {
  const flare = LAMP_CLIPS.flare;
  const scale = dur / (flare.dur - flare.hit);
  return flare.keys.filter(([t]) => t >= flare.hit).map(([t, p]): PoseKeyframe => [(t - flare.hit) * scale, p]);
}

/** J held, the arrival: she appears with the lantern thrust out in her Flare, rocks back on her heels and draws it in */
export const WENNA_WARP_STRIKE: ActionClip = {
  dur: CLIPS.warpStrike.dur,
  hit: 0,
  keys: flareFromHit(CLIPS.warpStrike.dur),
};

/**
 * the guard: sunk a little behind the pole held across her in both hands like a quarterstaff, tipped forward so the
 * lantern hangs out before her, the far hand lower on the shaft
 */
const HOLD = m({
  hx: -0.5,
  hy: -13,
  cb: 0.3,
  nx: 1.2,
  ny: -23.4,
  fx: 7.5,
  fy: -19.5,
  sa: -1.1,
  bx: 4.8,
  by: -14.2,
  be: 0,
  ffx: 4.5,
  bfx: -4.5,
  ba: 0.3,
});
const t = GUARD_TIMES;

/**
 * K: the pole snapped across her into place; the held guard breathing; the jolt of a block that rocks her back onto her
 * rear foot with the pole knocked upright; and Flare Back, the lantern thrust out and up in the attacker's face as its
 * shutter flies open, then drawn back to the guard.
 */
export const WENNA_GUARD: ActionClip = {
  dur: t.parryEnd,
  hit: 0,
  keys: [
    [0, m({ cb: 0.1, fx: 6.5, fy: -18.5, sa: -1.1, bx: 4.5, by: -14.5, be: 0 })],
    [t.loopFrom, HOLD, "snap"],
    [frame(16), { ...HOLD, ny: -23.1, cb: 0.5, fy: -19.8, by: -14.5, sa: -1.08 }],
    [frame(32), { ...HOLD, hy: -12.8, ny: -23.3, cb: 0.25, sa: -1.12 }],
    [t.loopTo - 0.001, HOLD],
    [
      t.block,
      {
        ...HOLD,
        hx: -2.2,
        cb: -0.5,
        nx: -0.6,
        ny: -23,
        fx: 6,
        fy: -19,
        sa: -1.25,
        bx: 4.1,
        by: -13.3,
        bfx: -6.5,
        ba: 0.6,
      },
      "snap",
    ],
    [
      t.block + frame(3),
      { ...HOLD, hx: -1.6, nx: 0.2, fx: 6.6, fy: -19.2, sa: -1.18, bx: 4.4, by: -13.6, bfx: -6, ba: 0.5 },
    ],
    [t.blockEnd - 0.001, HOLD],
    [
      t.parry,
      {
        ...HOLD,
        hx: 1.2,
        hy: -13.6,
        cb: 1.2,
        nx: 3.6,
        ny: -23.8,
        fx: 10,
        fy: -21,
        sa: -0.75,
        bx: 5.6,
        by: -16.9,
        ffx: 6,
      },
      "snap",
    ],
    [
      t.parry + frame(3),
      {
        ...HOLD,
        hx: 1.4,
        hy: -13.7,
        cb: 1.3,
        nx: 3.9,
        ny: -23.9,
        fx: 10.5,
        fy: -21.5,
        sa: -0.7,
        bx: 6,
        by: -17.3,
        ffx: 6,
      },
    ],
    [
      t.parry + frame(8),
      { ...HOLD, hx: 0.4, cb: 0.6, nx: 2.2, fx: 8.6, fy: -20.2, sa: -0.95, bx: 5.4, by: -15.4, ffx: 5.2 },
    ],
    [t.parryEnd, HOLD],
  ],
};
