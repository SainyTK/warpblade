import type { ActionClip } from "../../../types/pose";
import { GUARD_TIMES } from "../../combat";
import { frame } from "../../hero";
import { GUARD, g } from "./stance";

/** the near arm thrown straight out after the gauntlet, the far fist set at her chest, leaning into the chain */
const ARM_OUT = g({ hx: 1, nx: 4.5, ny: -21.5, cb: 1.5, fx: 16, fy: -20, bx: 3, by: -18, be: 0, ffx: 8, bfx: -6 });

/** her iron guard: sunk wide and low, both gauntlets stacked before her face, the near one over the far */
const IRON = g({
  hx: -1,
  hy: -11.5,
  nx: 0.5,
  ny: -21.5,
  cb: -0.5,
  fx: 7.5,
  fy: -22,
  bx: 8,
  by: -19,
  be: 0,
  ffx: 7,
  bfx: -7,
});

const t = GUARD_TIMES;

/**
 * Her poses for the moveset every hero shares: the gauntlet thrown on its chain and held out while it flies, the clamp
 * on arriving, and the iron guard with its block and Iron Catch.
 */
export const MOVESET_CLIPS = {
  /** the gauntlet cocks back by her ear, then the arm snaps straight out after it; the shared throw lets go at 0.1 s */
  throw: {
    dur: 0.15,
    hit: 0.1,
    keys: [
      [0, GUARD],
      [frame(1), g({ hx: -1, nx: -0.5, cb: -0.5, fx: 1, fy: -22, bx: 6, by: -19 })],
      [frame(2), g({ hx: -1.5, nx: -1, cb: -1, fx: -1, fy: -23, bx: 6, by: -19, ffx: 6 })],
      [frame(3), ARM_OUT, "snap"],
      [0.15, ARM_OUT],
    ],
  },
  /** the arm stays out along the chain and the weight goes on to the front foot as the haul begins */
  throwWait: {
    dur: frame(12),
    hit: 0,
    keys: [
      [0, ARM_OUT],
      [frame(6), g({ ...ARM_OUT, hx: 1.5, nx: 5, ny: -21, fx: 16.5, fy: -19.5, bx: 4, by: -17.5 })],
      [frame(12), ARM_OUT],
    ],
  },
  /** hauled in, both gauntlets clamp shut on the foe and she leans in to crush it, then sets back to her guard */
  warpStrike: {
    dur: 0.4,
    hit: 0,
    keys: [
      [0, g({ hx: 1.5, nx: 5, ny: -21, cb: 1.5, fx: 15, fy: -21, bx: 14, by: -16, be: 0, ffx: 8, bfx: -6, ba: 0.3 })],
      [frame(2), g({ nx: 5, ny: -21, cb: 1.5, fx: 11, fy: -19, bx: 11, by: -16, be: 0, ffx: 7, bfx: -6 }), "snap"],
      [frame(5), g({ nx: 4.5, ny: -21, cb: 1.5, fx: 11, fy: -19, bx: 11, by: -16.5, be: 0, ffx: 7, bfx: -6 })],
      [0.4, GUARD],
    ],
  },
  /**
   * The iron guard on the shared segments: the gauntlets slammed up together, held breathing, a block that drives her
   * back a pixel onto her rear foot, and Iron Catch, both hands shooting out open to seize the blow.
   */
  guard: {
    dur: t.parryEnd,
    hit: 0,
    keys: [
      [0, g({ hy: -12, fx: 7, fy: -20, bx: 6, by: -19 })],
      [t.loopFrom, IRON, "snap"],
      [frame(16), g({ ...IRON, ny: -21.2, fy: -21.7, by: -18.8 })],
      [frame(32), g({ ...IRON, hy: -11.3, ny: -21.3 })],
      [t.loopTo - 0.001, IRON],
      [
        t.block,
        g({ ...IRON, hx: -2, nx: -0.5, cb: -1, fx: 6, fy: -21.5, bx: 6.5, by: -18.5, bfx: -8, ba: 0.4 }),
        "snap",
      ],
      [t.block + frame(3), g({ ...IRON, hx: -1.5, nx: 0, fx: 7, bx: 7.5, bfx: -7.5, ba: 0.3 })],
      [t.blockEnd - 0.001, IRON],
      [
        t.parry,
        g({ hx: 1, nx: 4.5, ny: -21.5, cb: 1.5, fx: 15, fy: -20, bx: 14, by: -17, be: 0, ffx: 8, bfx: -6 }),
        "snap",
      ],
      [t.parry + frame(3), g({ hx: 1, nx: 4, ny: -21.5, cb: 1, fx: 13, fy: -19, bx: 12, by: -17, be: 0, ffx: 8 })],
      [t.parry + frame(8), g({ ...IRON, nx: 1.5, fx: 9, bx: 8.5 })],
      [t.parryEnd, IRON],
    ],
  },
} satisfies Record<string, ActionClip>;
