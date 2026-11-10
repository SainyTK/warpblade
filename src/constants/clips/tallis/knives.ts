import type { ActionClip } from "../../../types/pose";
import type { KnifeBlow } from "../../../types/tallis";
import { frame } from "../../hero";
import { KNIFE_BLOWS } from "../../tallis/knives";
import { REVERSE, STANCE, s, TUCK } from "./stance";

/** the clip's length and hit frame come from the blow's own numbers */
const timed = (blow: KnifeBlow, keys: ActionClip["keys"]): ActionClip => ({
  dur: KNIFE_BLOWS[blow].dur,
  hit: KNIFE_BLOWS[blow].hit,
  keys,
});

/** the crouch he rises out of the pool from, and drops into for Hamstring */
const LOW = s({
  hx: -0.5,
  hy: -8,
  nx: 1.5,
  ny: -16.5,
  cb: 1.2,
  fx: 4,
  fy: -7,
  sa: 2.6,
  bx: 4,
  by: -12,
  ffx: 6,
  bfx: -6,
});

/**
 * His knife blows. Each draws the knife the other way first, snaps to a new silhouette on its hit frame, holds it for
 * the hit-stop, follows through and settles back to the stance, so the next blow starts where this one left him.
 */
export const KNIFE_CLIPS: Record<KnifeBlow, ActionClip> = {
  /** one calm frame with the near knife drawn to the hip, a snap out on frame 3, the wrist rolling back after */
  flick: timed("flick", [
    [0, STANCE],
    [frame(2), s({ hx: -1, nx: 1.5, cb: 0.3, fx: 2.5, fy: -13.5, sa: 2.6 })],
    [frame(3), s({ hx: 0, nx: 3.5, cb: 1.1, fx: 10.5, fy: -16.5, sa: 0.15, ffx: 5.5, bfx: -5 }), "snap"],
    [frame(4), s({ hx: 0, nx: 3.4, cb: 1.05, fx: 10.3, fy: -16.4, sa: 0.3, ffx: 5.5, bfx: -5 })],
    [frame(6), s({ hx: -0.2, nx: 2.8, cb: 0.9, fx: 8.5, fy: -16.2, sa: 1.1, ffx: 5, bfx: -4.8 })],
    [frame(8), STANCE],
  ]),
  /** the shoulders turn back, the far knife crosses on frame 4 under the near arm, the cloak swings after */
  cross: timed("cross", [
    [0, STANCE],
    [frame(2), s({ nx: 0.8, cb: 0.2, hx: -1, bx: 0.5, by: -18.5, fx: 7, fy: -18, sa: 1.4 })],
    [frame(3), s({ nx: 0.4, cb: 0.1, hx: -1.2, bx: -0.5, by: -18, fx: 7.5, fy: -18.5, sa: 1.2 })],
    [frame(4), s({ nx: 3.8, cb: 1.2, hx: 0.3, bx: 11, by: -16, be: 0, fx: 4, fy: -19, sa: -0.4, ffx: 5.5 }), "snap"],
    [frame(5), s({ nx: 3.6, cb: 1.1, hx: 0.3, bx: 10.6, by: -16.2, be: 0, fx: 4.2, fy: -19, sa: -0.2 })],
    [frame(7), s({ nx: 3, cb: 0.9, bx: 8, by: -17.5, be: 0, fx: 5, fy: -18, sa: 0.8 })],
    [frame(9), STANCE],
  ]),
  /** three frames winding onto the back leg with the near knee drawn up, a spinning heel on frame 6, a hop back into a crouch */
  heelKick: timed("heelKick", [
    [0, STANCE],
    [frame(2), s({ hx: -1.5, nx: 0.5, cb: 0, ffx: 3, ffy: -2, bfx: -4, fx: 4, fy: -18, bx: 2, by: -20 })],
    [
      frame(4),
      s({
        hx: -2,
        hy: -13,
        nx: -0.5,
        ny: -22.5,
        cb: -0.3,
        ffx: 3,
        ffy: -8,
        fa: -0.3,
        bfx: -4,
        fx: 2,
        fy: -19,
        bx: 0,
        by: -20,
      }),
    ],
    [
      frame(6),
      s({
        hx: -1.5,
        hy: -13.5,
        nx: -2.5,
        ny: -22,
        cb: -0.8,
        ffx: 12,
        ffy: -12,
        fa: -0.7,
        bfx: -3.5,
        ba: 0.3,
        fx: -2,
        fy: -17,
        bx: -4,
        by: -19,
        sa: 2.2,
      }),
      "snap",
    ],
    [
      frame(7),
      s({
        hx: -1.5,
        hy: -13.5,
        nx: -2.3,
        ny: -22,
        cb: -0.7,
        ffx: 11.5,
        ffy: -11.5,
        fa: -0.6,
        bfx: -3.5,
        fx: -1.5,
        fy: -17,
        bx: -3.5,
        by: -19,
        sa: 2.1,
      }),
    ],
    [
      frame(9),
      s({
        hx: -1,
        hy: -13,
        nx: -0.5,
        ny: -22.5,
        ffx: 6,
        ffy: -5,
        fa: -0.2,
        bfx: -4,
        fx: 2,
        fy: -17.5,
        bx: 1,
        by: -19.5,
      }),
    ],
    [frame(11), s({ hx: -0.8, hy: -11, nx: 1.5, ny: -20.5, cb: 0.8, ffx: 5, bfx: -5, fx: 5, fy: -15, bx: 4, by: -18 })],
    [frame(13), STANCE],
  ]),
  /** three frames rising onto the toes with the knife high, a drive down on frame 5, the blade left in for two frames */
  backstab: timed("backstab", [
    [0, STANCE],
    [frame(2), s({ hy: -13.5, ny: -23.2, nx: 1.5, cb: 0.2, fx: 6, fy: -21, sa: REVERSE - 0.2, fa: 0.3, ba: 0.4 })],
    [
      frame(4),
      s({ hy: -14.2, ny: -24, nx: 1.2, cb: 0, fx: 5.5, fy: -24, sa: REVERSE - 0.3, fa: 0.5, ba: 0.6, bx: 3, by: -21 }),
    ],
    [
      frame(5),
      s({ hy: -12, ny: -21.5, nx: 4.5, cb: 1.5, fx: 11, fy: -14, sa: 1.35, ffx: 6, bfx: -4.5, bx: 7, by: -16 }),
      "snap",
    ],
    [
      frame(7),
      s({ hy: -12, ny: -21.5, nx: 4.3, cb: 1.4, fx: 10.8, fy: -14.2, sa: 1.4, ffx: 6, bfx: -4.5, bx: 7, by: -16 }),
    ],
    [frame(9), s({ hy: -12.3, ny: -21.8, nx: 3, cb: 1, fx: 8.5, fy: -15.5, sa: 1.6, ffx: 5.2, bfx: -4.5 })],
    [frame(10), STANCE],
  ]),
  /** the knife still in, the wrist turns with a burst of rose sparks, no travel */
  twist: timed("twist", [
    [0, STANCE],
    [frame(2), s({ nx: 3.8, cb: 1.3, fx: 10.5, fy: -15, sa: 1.5, ffx: 5.5, bx: 6.5, by: -17 })],
    [frame(4), s({ nx: 4.2, cb: 1.5, fx: 11, fy: -15.5, sa: -0.5, fe: 1, ffx: 5.5, bx: 7, by: -17 }), "snap"],
    [frame(6), s({ nx: 4, cb: 1.4, fx: 10.6, fy: -15.5, sa: 0.3, fe: 1, ffx: 5.5, bx: 6.5, by: -17.5 })],
    [frame(9), STANCE],
  ]),
  /** a low crouch, a wide sweep on frame 5, then the arm carries round across his body and he squares up again */
  gutSlash: timed("gutSlash", [
    [0, STANCE],
    [frame(2), s({ hy: -10.5, ny: -19.5, nx: 1, cb: 0.8, fx: 1.5, fy: -11.5, sa: 2.8, ffx: 6, bfx: -5.5 })],
    [frame(4), s({ hy: -9.5, ny: -18.5, nx: 0.5, cb: 0.9, fx: 0, fy: -11, sa: 3, ffx: 6.5, bfx: -6, bx: 3, by: -15 })],
    [
      frame(5),
      s({ hy: -10, ny: -19.5, nx: 4.5, cb: 1.4, fx: 12, fy: -12.5, sa: 0.1, ffx: 7.5, bfx: -6, bx: 1, by: -16 }),
      "snap",
    ],
    [
      frame(6),
      s({ hy: -10, ny: -19.5, nx: 4.3, cb: 1.3, fx: 11.5, fy: -13, sa: -0.15, ffx: 7.5, bfx: -6, bx: 1, by: -16 }),
    ],
    [
      frame(8),
      s({ hy: -11, ny: -20.5, nx: 2.5, cb: 0.6, fx: 6, fy: -18, sa: -0.9, fe: 1, ffx: 6, bfx: -5.5, bx: 2, by: -18 }),
    ],
    [frame(10), s({ hy: -12, ny: -21.5, nx: 2, cb: 0.6, fx: 5.5, fy: -16.5, sa: 1.2, ffx: 5, bfx: -5 })],
    [frame(12), STANCE],
  ]),
  /** a tuck with both knives raised, then straight down with both under him, held to the landing */
  dropStab: timed("dropStab", [
    [0, s({ ...TUCK, hy: -14, ny: -24, fx: 5, fy: -22, sa: -1.2, bx: 3, by: -23, be: 1 })],
    [frame(2), s({ ...TUCK, hy: -14.5, ny: -24.5, nx: 1, fx: 4, fy: -24, sa: -1.4, bx: 2, by: -24.5, be: 1 })],
    [
      frame(4),
      s({
        ...TUCK,
        ffy: -6.5,
        bfy: -5,
        hy: -15,
        ny: -24,
        nx: 2,
        cb: 1,
        fx: 4,
        fy: -6,
        sa: Math.PI / 2,
        bx: 1.5,
        by: -7,
        be: 0,
      }),
      "snap",
    ],
    [
      frame(10),
      s({
        ...TUCK,
        ffy: -6.5,
        bfy: -5,
        hy: -15,
        ny: -24,
        nx: 2,
        cb: 1,
        fx: 4,
        fy: -6,
        sa: Math.PI / 2,
        bx: 1.5,
        by: -7,
        be: 0,
      }),
    ],
  ]),
  /** from the pool's crouch, a rise onto the toes on frame 3 with the knife swept up overhead, then down into the stance */
  risingCut: timed("risingCut", [
    [0, LOW],
    [frame(2), s({ hy: -11.5, ny: -20.5, nx: 2.5, cb: 0.8, fx: 6, fy: -10, sa: 2.4, ffx: 5, bfx: -5, bx: 4, by: -15 })],
    [
      frame(3),
      s({
        hy: -14.5,
        ny: -25,
        nx: 3,
        cb: 0.3,
        fx: 7,
        fy: -27,
        sa: -1.3,
        ffx: 3.5,
        bfx: -4,
        fa: 0.4,
        ba: 0.5,
        bx: 2,
        by: -19,
      }),
      "snap",
    ],
    [
      frame(5),
      s({
        hy: -14.3,
        ny: -24.8,
        nx: 2.8,
        cb: 0.3,
        fx: 6.5,
        fy: -26.5,
        sa: -1.5,
        ffx: 3.5,
        bfx: -4,
        fa: 0.3,
        ba: 0.4,
        bx: 2,
        by: -19,
      }),
    ],
    [frame(8), s({ hy: -13, ny: -23, nx: 2.2, fx: 6.5, fy: -19, sa: 0.6, ffx: 4.5, bfx: -4.5 })],
    [frame(11), STANCE],
  ]),
  /** a drop into a low lunge, the knife wound back, a sweep at the shins on frame 5, then up out of the crouch */
  hamstring: timed("hamstring", [
    [0, STANCE],
    [frame(2), s({ ...LOW, ffx: 7, bfx: -6.5 })],
    [frame(4), s({ ...LOW, fx: 0.5, fy: -6, sa: 3, ffx: 7.5, bfx: -6.5 })],
    [frame(5), s({ ...LOW, nx: 5, cb: 1.6, fx: 13, fy: -3.5, sa: 0.1, ffx: 8, bfx: -6.5, bx: 6, by: -11 }), "snap"],
    [frame(7), s({ ...LOW, nx: 4.6, cb: 1.5, fx: 12, fy: -4, sa: -0.25, ffx: 8, bfx: -6.5, bx: 6, by: -11 })],
    [frame(9), s({ hy: -10.5, ny: -19.5, nx: 3, cb: 1, fx: 8, fy: -10, sa: 1, ffx: 6, bfx: -5.5 })],
    [frame(12), STANCE],
  ]),
};
