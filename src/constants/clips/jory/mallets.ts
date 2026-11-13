import type { MalletBlow } from "../../../types/jory";
import type { ActionClip } from "../../../types/pose";
import { frame } from "../../hero";
import { MALLET_BLOWS } from "../../jory/mallets";
import { RIDE_UP, s } from "./stance";

/** the clip's length and first hit frame come from the blow's own numbers */
const timed = (blow: MalletBlow, keys: ActionClip["keys"]): ActionClip => ({
  dur: MALLET_BLOWS[blow].dur,
  hit: MALLET_BLOWS[blow].hits[0],
  keys,
});

/** the mallet at the bottom of a blow: chest high, its head driven forward and down */
const TAP_LOW = s({ hx: 0.3, nx: 2.6, ny: -23.2, cb: 1, fx: 9.5, fy: -16, sa: 0.35, ba: 0.45, bfx: -4 });

/** both mallets cocked back at the shoulders, the start of Roll */
const ROLL_COCK = s({ nx: 0.6, cb: 0.2, fx: 2.2, fy: -22, sa: -2.35, bx: 1.2, by: -21.5, be: 0 });

/** Crash's peak: up on the toes with both mallets high over his head, the drum at his front */
const CRASH_HIGH = s({
  hy: -15.2,
  ny: -25.6,
  nx: 0.8,
  cb: 0,
  fx: 3,
  fy: -27.5,
  sa: -1.75,
  bx: 1.2,
  by: -27,
  be: 0,
  fa: 0.55,
  ba: 0.55,
  dr: 1,
});

/** Crash's strike: a deep knee bend, both mallets down on the drum head */
export const CRASH_LOW = s({
  hx: 0.2,
  hy: -9.5,
  ny: -19.2,
  nx: 3,
  cb: 1.3,
  fx: 9,
  fy: -11.5,
  sa: 0.55,
  bx: 8,
  by: -11.8,
  be: 0,
  ffx: 6.2,
  bfx: -6.2,
  dr: 1,
});

/** Downstroke's tuck: knees drawn up, both mallets raised */
const TUCK = s({
  hy: -16,
  ny: -25.5,
  nx: 1,
  fx: 3,
  fy: -27,
  sa: -1.7,
  bx: 1,
  by: -26.5,
  be: 0,
  ffx: 3,
  ffy: -5,
  fa: 0.4,
  bfx: -2,
  bfy: -3.5,
  ba: 0.5,
});

/**
 * His mallet blows. Each starts from the ride's raised mallet or the last blow's follow-through, holds one calm frame of
 * wind-up, snaps to the strike on its early hit frame so the impact lands near the beat pressed on, holds the bounce off
 * the hit, and rises back into the ride as the next beat comes, where the next blow starts.
 */
export const MALLET_CLIPS: Record<MalletBlow, ActionClip> = {
  /** the near mallet cocks over the ear with the hips turned in, then snaps down to chest height, the back heel lifting */
  tap: timed("tap", [
    [0, RIDE_UP],
    [frame(1), s({ hx: -0.8, cb: 0.2, nx: 0.8, fx: 2.6, fy: -23.2, sa: -2.4, ba: 0.1 })],
    [frame(2), TAP_LOW, "snap"],
    [frame(4), s({ hx: 0.2, nx: 2.3, cb: 0.9, fx: 8.4, fy: -17.8, sa: -0.25, ba: 0.3, bfx: -4.2 })],
    [frame(7), s({ nx: 1.8, cb: 0.7, fx: 7, fy: -18.4, sa: -0.75, ffx: 5 })],
    [frame(11), s({ fx: 5, fy: -19.6, sa: -1.35 })],
    [frame(15), RIDE_UP],
  ]),
  /** both mallets drawn back, near down on 2, far down on 5, the shoulders rocking; the drum swings to his belly */
  roll: timed("roll", [
    [0, RIDE_UP],
    [frame(1), ROLL_COCK],
    [frame(2), s({ nx: 2.4, cb: 1, fx: 9.2, fy: -16, sa: 0.35, bx: 1.6, by: -22, be: 0 }), "snap"],
    [frame(4), s({ nx: 1.8, cb: 0.6, fx: 6.5, fy: -19, sa: -0.9, bx: 1.4, by: -22.5, be: 0 })],
    [frame(5), s({ nx: 0.4, cb: 0.4, fx: 4, fy: -21.5, sa: -1.9, bx: 8.4, by: -16, be: 0 }), "snap"],
    [frame(7), s({ nx: 1, cb: 0.5, fx: 5, fy: -20, sa: -1.4, bx: 6.4, by: -18, be: 0, dr: 0.3 })],
    [frame(9), s({ fx: 5.5, fy: -19.5, sa: -1.3, bx: 5, by: -18.5, be: 0, dr: 0.65 })],
    [frame(11), s({ fx: 5, fy: -20.5, sa: -1.6, bx: 4.4, by: -19.5, be: 0, dr: 0.9 })],
    [frame(15), s({ fx: 4.4, fy: -21.5, sa: -1.85, bx: 3.6, by: -20.5, be: 0, dr: 1 })],
  ]),
  /** up onto the toes with both mallets high, then down on the drum head in a deep knee bend, held through the hit-stop */
  crash: timed("crash", [
    [0, s({ fx: 4.4, fy: -21.5, sa: -1.85, bx: 3.6, by: -20.5, be: 0, dr: 1 })],
    [frame(1), CRASH_HIGH],
    [frame(2), { ...CRASH_HIGH, hy: -15.4, fy: -27.8, by: -27.3 }],
    [frame(3), CRASH_LOW, "snap"],
    [frame(5), { ...CRASH_LOW, hy: -9.2, fy: -11, by: -11.3 }],
    [frame(9), { ...CRASH_LOW, hy: -9.8, ny: -19.6, fy: -11.8 }],
    [frame(13), s({ hy: -12, ny: -22, nx: 2, cb: 0.9, fx: 7.5, fy: -15.5, sa: -0.4, bx: 6, by: -15, be: 0, dr: 0.6 })],
    [frame(17), s({ fx: 5, fy: -19, sa: -1.3, dr: 0.15 })],
    [frame(19), RIDE_UP],
  ]),
  /** the knee chambers with the weight back, the foot drives out flat at the foe's middle, then sets down */
  kick: timed("kick", [
    [0, RIDE_UP],
    [frame(2), s({ hx: -1.2, hy: -14.4, nx: -0.4, cb: -0.2, ffx: 3.2, ffy: -7, fa: 0.6, fx: 4, fy: -21, sa: -1.9 })],
    [
      frame(3),
      s({ hx: -1.6, hy: -14.6, nx: -1.2, cb: -0.4, ffx: 11.5, ffy: -9, fa: -0.7, fx: 2.4, fy: -20, sa: -2.1 }),
      "snap",
    ],
    [frame(5), s({ hx: -1.5, hy: -14.5, nx: -1, cb: -0.3, ffx: 11, ffy: -8.6, fa: -0.6, fx: 2.6, fy: -20, sa: -2.1 })],
    [frame(8), s({ hx: -0.8, hy: -14, nx: 0.4, ffx: 5, ffy: -3, fa: 0.3, fx: 4, fy: -20, sa: -1.7 })],
    [frame(12), s({ ffx: 5, fx: 4.4, fy: -20.4, sa: -1.8 })],
    [frame(15), RIDE_UP],
  ]),
  /** a tuck with both mallets raised that hangs a frame at the top, then both mallets driven down under him */
  downstroke: timed("downstroke", [
    [0, s({ hy: -15, ny: -25, fx: 4, fy: -24, sa: -1.7, bx: 2, by: -23, be: 0, ffx: 3, ffy: -3, bfx: -3, bfy: -2 })],
    [frame(2), TUCK],
    [frame(3), { ...TUCK, fy: -27.4, by: -26.8 }],
    [
      frame(4),
      s({
        hy: -15.5,
        ny: -24.5,
        nx: 2.6,
        cb: 1.2,
        fx: 6.5,
        fy: -6,
        sa: 1.35,
        bx: 4.5,
        by: -6.5,
        be: 0,
        ffx: 3.5,
        ffy: -4,
        bfx: -2.5,
        bfy: -2.5,
      }),
      "snap",
    ],
    [
      frame(12),
      s({
        hy: -15.2,
        ny: -24.4,
        nx: 2.4,
        cb: 1.1,
        fx: 6.2,
        fy: -6.6,
        sa: 1.3,
        bx: 4.4,
        by: -7,
        be: 0,
        ffx: 3.5,
        ffy: -3,
        bfx: -2.5,
        bfy: -2,
      }),
    ],
  ]),
};
