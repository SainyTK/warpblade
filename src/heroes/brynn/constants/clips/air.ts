import { frame } from "../../../../constants/hero";
import type { ActionClip } from "../../../../types/pose";
import { twoHand } from "./key";

/**
 * The falling slam, her one air blow: she tucks with the blade raised overhead and held back, then drives it straight
 * down under her on frame 6 and rides it to the floor.
 */
export const BRYNN_AIR_CLIPS = {
  airSlam: {
    dur: frame(16),
    hit: frame(6),
    keys: [
      twoHand(0, { hy: -16, cb: -0.5, nx: 1, ny: -26, fx: 3, fy: -31, sa: -2, ffx: 3, ffy: -5, bfx: -3, bfy: -3 }),
      twoHand(2, {
        hy: -16.5,
        cb: -1.2,
        nx: 0,
        ny: -26.5,
        fx: 1,
        fy: -33,
        sa: -2.45,
        ffx: 4,
        ffy: -7,
        fa: 0.3,
        bfx: -3,
        bfy: -5,
      }),
      twoHand(5, {
        hy: -16.6,
        cb: -1.4,
        nx: -0.4,
        ny: -26.6,
        fx: 0.4,
        fy: -33.4,
        sa: -2.55,
        ffx: 4,
        ffy: -7.5,
        fa: 0.3,
        bfx: -3,
        bfy: -5.5,
      }),
      twoHand(
        6,
        {
          hx: 0.5,
          hy: -15,
          cb: 1.2,
          nx: 4,
          ny: -24,
          fx: 6,
          fy: -17,
          sa: 1.38,
          ffx: 3,
          ffy: -2,
          fa: 0.4,
          bfx: -4,
          bfy: -4,
        },
        true,
      ),
      twoHand(8, {
        hx: 0.5,
        hy: -15,
        cb: 1.4,
        nx: 4.3,
        ny: -23.8,
        fx: 6.2,
        fy: -16.5,
        sa: 1.4,
        ffx: 3,
        ffy: -1.5,
        fa: 0.4,
        bfx: -4,
        bfy: -3.5,
      }),
      twoHand(16, {
        hx: 0.5,
        hy: -15,
        cb: 1.4,
        nx: 4.3,
        ny: -23.8,
        fx: 6.2,
        fy: -16.5,
        sa: 1.4,
        ffx: 3,
        ffy: -1.5,
        fa: 0.4,
        bfx: -4,
        bfy: -3.5,
      }),
    ],
  },
} satisfies Record<string, ActionClip>;
