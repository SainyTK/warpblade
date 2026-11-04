import type { HeroState } from "../../../types/hero";
import type { ActionClip } from "../../../types/pose";
import { frame, pose } from "../../hero";

/** the glaive held low and forward in both hands, before and after the rite */
const LOW_GUARD = pose({ fx: 7, fy: -16, sa: 0.3, bx: 2, by: -17.5, ffx: 4, bfx: -4 });

/**
 * Ysra calling a rite: she lifts the glaive straight up over her head onto her toes, then drops to one knee and drives
 * its butt into the floor, blade up. The rite bursts out on the plant; she holds the kneel a breath and rises.
 */
const RITE: ActionClip = {
  dur: frame(18),
  hit: frame(8),
  keys: [
    [0, LOW_GUARD],
    [frame(2), pose({ hy: -14.5, nx: 0.5, ny: -24.5, fx: 6, fy: -21, sa: -0.8, bx: 2.5, by: -17.5, ffx: 4, bfx: -4 })],
    [
      frame(3),
      pose({ hy: -15, cb: 0.8, nx: 0.3, ny: -25.3, fx: 5, fy: -27, sa: -1.3, bx: 3.5, by: -22, ffx: 4, bfx: -4 }),
    ],
    [
      frame(4),
      pose({
        hy: -15.5,
        cb: 1.5,
        nx: 0,
        ny: -26,
        fx: 4,
        fy: -32,
        sa: -1.57,
        bx: 4,
        by: -27,
        ffx: 4,
        ffy: -1,
        fa: 0.5,
        bfx: -4,
        bfy: -1,
        ba: 0.5,
      }),
    ],
    [
      frame(5),
      pose({
        hy: -16,
        cb: 1.5,
        nx: -0.2,
        ny: -26.5,
        fx: 4,
        fy: -33,
        sa: -1.57,
        bx: 4,
        by: -28,
        ffx: 4,
        ffy: -1.2,
        fa: 0.6,
        bfx: -4,
        bfy: -1.2,
        ba: 0.6,
      }),
    ],
    [
      frame(6),
      pose({ hy: -12, cb: 0.5, nx: 2.5, ny: -21, fx: 7, fy: -19, sa: -1.57, bx: 7, by: -25, ffx: 5, bfx: -5 }),
      "snap",
    ],
    [
      frame(7),
      pose({ hy: -10, cb: 1, nx: 3, ny: -19, fx: 7.5, fy: -13, sa: -1.57, bx: 7.5, by: -19.5, ffx: 6, bfx: -6 }),
    ],
    [
      frame(8),
      pose({
        hy: -8.5,
        cb: 1,
        nx: 3.5,
        ny: -18,
        fx: 8,
        fy: -9,
        sa: -1.57,
        bx: 8,
        by: -15.5,
        ffx: 6,
        bfx: -7,
        ba: 0.8,
      }),
      "snap",
    ],
    [
      frame(9),
      pose({
        hy: -8,
        cb: 1.2,
        nx: 3.5,
        ny: -17.5,
        fx: 8,
        fy: -9,
        sa: -1.57,
        bx: 8,
        by: -15.5,
        ffx: 6,
        bfx: -7,
        ba: 0.8,
      }),
    ],
    [
      frame(11),
      pose({ hy: -8, cb: 1, nx: 3.3, ny: -17.8, fx: 8, fy: -9, sa: -1.57, bx: 8, by: -15.5, ffx: 6, bfx: -7, ba: 0.8 }),
    ],
    [
      frame(13),
      pose({
        hy: -11,
        cb: 0.5,
        nx: 2.5,
        ny: -21,
        fx: 8,
        fy: -13,
        sa: -1.2,
        bx: 6.5,
        by: -19,
        ffx: 5,
        bfx: -6,
        ba: 0.4,
      }),
    ],
    [frame(15), pose({ hy: -13, nx: 1.5, ny: -23, fx: 7.5, fy: -15, sa: -0.3, bx: 3, by: -17, ffx: 4.5, bfx: -5 })],
    [
      frame(16),
      pose({ hy: -13.7, nx: 1.2, ny: -23.7, fx: 7.2, fy: -15.7, sa: 0.1, bx: 2.3, by: -17.3, ffx: 4, bfx: -4 }),
    ],
    [frame(18), LOW_GUARD],
  ],
};

/** Ysra's rite state, posed by her kit */
export const PYRE_STATE_CLIPS = {
  rite: RITE,
} satisfies Partial<Record<HeroState, ActionClip>>;
