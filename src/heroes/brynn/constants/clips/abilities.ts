import { frame } from "../../../../constants/hero";
import type { ActionClip } from "../../../../types/pose";
import { BRYNN_READY as R, twoHand } from "./key";

/** the frame each ability clip lets its effect loose on; Carry starts the clip this many frames before it */
export const ABILITY_HIT = { rend: 7, quake: 8 } as const;

/**
 * Her two base abilities: Rend, a cut up out of the floor that throws a wave along it, and Quake, the blade driven
 * point first into the floor. Both load for three frames or more before they strike.
 */
export const BRYNN_ABILITY_CLIPS = {
  rend: {
    dur: frame(16),
    hit: frame(ABILITY_HIT.rend),
    keys: [
      twoHand(0, R),
      twoHand(2, { hx: -1.5, hy: -10, cb: 1, nx: 2, ny: -19.5, fx: -3, fy: -8, sa: 2.65, ffx: 6, bfx: -6.5, ba: 0.4 }),
      twoHand(6, {
        hx: -1.7,
        hy: -9.6,
        cb: 1.2,
        nx: 2.3,
        ny: -19,
        fx: -3.6,
        fy: -7.4,
        sa: 2.7,
        ffx: 6.5,
        bfx: -6.8,
        ba: 0.5,
      }),
      twoHand(
        ABILITY_HIT.rend,
        { hx: 2, hy: -13.5, cb: 0.4, nx: 5, ny: -23.5, fx: 12, fy: -22, sa: -0.75, ffx: 9, bfx: -6, ba: 0.6 },
        true,
      ),
      twoHand(10, {
        hx: 2.2,
        hy: -13.8,
        cb: 0.2,
        nx: 5,
        ny: -24,
        fx: 11.5,
        fy: -25,
        sa: -1.1,
        ffx: 9,
        bfx: -6,
        ba: 0.6,
      }),
      twoHand(16, R),
    ],
  },
  quake: {
    dur: frame(19),
    hit: frame(ABILITY_HIT.quake),
    keys: [
      twoHand(0, R),
      twoHand(3, { hx: 0, hy: -14.5, cb: -0.5, nx: 1, ny: -24.5, fx: 6, fy: -30, sa: 1.45, ffx: 5, bfx: -5 }),
      twoHand(7, { hx: 0, hy: -15, cb: -0.8, nx: 1, ny: -25, fx: 6, fy: -31.5, sa: 1.48, ffx: 5, bfx: -5, ba: 0.3 }),
      twoHand(
        ABILITY_HIT.quake,
        { hx: 1, hy: -10, cb: 1.4, nx: 4.5, ny: -19.5, fx: 7.5, fy: -16.5, sa: 1.5, ffx: 6.5, bfx: -6, ba: 0.5 },
        true,
      ),
      twoHand(13, {
        hx: 1,
        hy: -9.6,
        cb: 1.5,
        nx: 4.7,
        ny: -19.1,
        fx: 7.6,
        fy: -16,
        sa: 1.5,
        ffx: 6.5,
        bfx: -6,
        ba: 0.5,
      }),
      twoHand(19, R),
    ],
  },
} satisfies Record<string, ActionClip>;
