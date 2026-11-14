import { ACTION_CLIPS } from "../../../../constants/clips";
import { frame, pose } from "../../../../constants/hero";
import type { ActionClip } from "../../../../types/pose";
import { EN_GARDE } from "./base";

const THROW = ACTION_CLIPS.throw;
const ARRIVE = ACTION_CLIPS.warpStrike;

/** the throw: the rapier drawn back over the shoulder like a dart and let go along the line on the shared release */
export const CERISE_THROW: ActionClip = {
  dur: THROW.dur,
  hit: THROW.hit,
  keys: [
    [0, pose({ ...EN_GARDE, hx: -1.5, nx: -2, cb: -0.6, fx: -2, fy: -23.5, sa: -0.05, bx: 3, by: -20 })],
    [
      THROW.hit - 0.001,
      pose({ ...EN_GARDE, hx: -1.8, nx: -2.3, cb: -0.7, fx: -2.5, fy: -24, sa: -0.05, bx: 3.5, by: -20 }),
    ],
    [
      THROW.hit,
      pose({ ...EN_GARDE, hx: 1.5, nx: 4.5, ny: -22.5, cb: 0.6, fx: 15, fy: -21, sa: -0.1, bx: -8, by: -18, ffx: 8 }),
      "snap",
    ],
    [
      THROW.dur,
      pose({
        ...EN_GARDE,
        hx: 1.6,
        nx: 4.6,
        ny: -22.5,
        cb: 0.6,
        fx: 15.5,
        fy: -20.5,
        sa: -0.08,
        bx: -8,
        by: -18,
        ffx: 8,
      }),
    ],
  ],
};

/** the arrival: she appears already at full stretch in a thrust through the foe, holds it, and draws back to en garde */
export const CERISE_ARRIVE: ActionClip = {
  dur: ARRIVE.dur,
  hit: 0,
  keys: [
    [
      0,
      pose({
        ...EN_GARDE,
        hx: 3,
        hy: -10.5,
        nx: 7.5,
        ny: -20,
        cb: 0.5,
        fx: 21,
        fy: -17,
        sa: 0.02,
        bx: -7,
        by: -12,
        ffx: 11,
        bfx: -7,
        ba: 0.5,
      }),
    ],
    [
      frame(4),
      pose({
        ...EN_GARDE,
        hx: 3.2,
        hy: -10.4,
        nx: 7.8,
        ny: -19.9,
        cb: 0.6,
        fx: 21.5,
        fy: -16.8,
        sa: 0.03,
        bx: -7,
        by: -11.5,
        ffx: 11,
        bfx: -7,
        ba: 0.5,
      }),
    ],
    [
      frame(8),
      pose({
        ...EN_GARDE,
        hx: 1.5,
        hy: -12,
        nx: 4,
        ny: -22,
        fx: 15,
        fy: -17.5,
        sa: 0,
        bx: -7,
        by: -17,
        ffx: 9,
        bfx: -6,
        ba: 0.4,
      }),
    ],
    [ARRIVE.dur, EN_GARDE],
  ],
};
