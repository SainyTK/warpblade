import type { ActionClip } from "../../../types/pose";
import { frame } from "../../hero";
import { BACKSTEP_TIMES, BRACE_TIMES } from "../../ysra/stance";
import { y } from "./stanceBase";

/** the brace: sunk low behind the haft held near upright in front of her, the far hand high up it toward the blade */
const GUARD = {
  hx: -1,
  hy: -11.5,
  cb: 0.5,
  nx: 2.5,
  ny: -21.5,
  fx: 7,
  fy: -13,
  sa: -1.32,
  ffx: 6,
  bfx: -6,
  ba: 0.3,
} as const;
const HAFT = -8;
const t = BRACE_TIMES;

/** Ysra bracing, blocking and parrying; backstepping; thrown back by a blow. */
export const STANCE_GUARD_CLIPS = {
  /**
   * In segments: the haft snapped up into place; the held guard breathing; the jolt of a block, driven back onto the rear
   * foot; and the parry, the haft whipped outward and up to knock the blow aside, then back into place.
   */
  brace: {
    dur: t.parryEnd,
    hit: 0,
    keys: [
      [0, y({ hy: -12.5, nx: 2, ny: -22.5, fx: 6, fy: -15, sa: -0.95, ffx: 5, bfx: -5 }, HAFT)],
      [frame(2), y({ ...GUARD, hy: -11, ny: -21, fx: 7.5, sa: -1.4 }, HAFT)],
      [t.loopFrom, y(GUARD, HAFT)],
      [frame(13), y({ ...GUARD, ny: -22, cb: 1, fy: -13.5 }, HAFT)],
      [frame(22), y({ ...GUARD, ny: -22, cb: 1, fy: -13.5, sa: -1.34 }, HAFT)],
      [frame(31), y({ ...GUARD, hy: -11, ny: -21, cb: 0, fy: -12.5, sa: -1.3 }, HAFT)],
      [t.loopTo - 0.001, y(GUARD, HAFT)],
      [
        t.block,
        y(
          { ...GUARD, hx: -2.5, hy: -11, cb: -0.5, nx: 0, ny: -21, fx: 5, fy: -12.5, sa: -1.5, bfx: -7, ba: 0.6 },
          HAFT,
        ),
        "snap",
      ],
      [t.block + frame(2), y({ ...GUARD, hx: -2, nx: 0.5, ny: -21, fx: 5.5, sa: -1.45, bfx: -7, ba: 0.5 }, HAFT)],
      [t.block + frame(5), y({ ...GUARD, hx: -1.5, nx: 2, fx: 6.5, sa: -1.36 }, HAFT)],
      [t.blockEnd - 0.001, y(GUARD, HAFT)],
      [t.parry, y({ ...GUARD, hy: -12, nx: 3.5, ny: -22, fx: 9, fy: -17, sa: -2.1, ffx: 7 }, HAFT), "snap"],
      [
        t.parry + frame(2),
        y({ ...GUARD, hy: -12.5, cb: -0.5, nx: 3, ny: -23, fx: 8, fy: -21, sa: -2.55, ffx: 7 }, HAFT),
      ],
      [
        t.parry + frame(5),
        y({ ...GUARD, hy: -12.5, cb: -0.5, nx: 3, ny: -23, fx: 8, fy: -21, sa: -2.6, ffx: 7 }, HAFT),
      ],
      [t.parry + frame(9), y({ ...GUARD, hy: -12, nx: 3, ny: -22, fx: 7.5, fy: -16, sa: -1.7, ffx: 6.5 }, HAFT)],
      [t.parryEnd, y(GUARD, HAFT)],
    ],
  },
  /** a low hop back off the front foot, still facing the foe, the glaive pulled in across her; a skid on the landing */
  backstep: {
    dur: BACKSTEP_TIMES.end,
    hit: 0,
    keys: [
      [0, y({ hy: -12, nx: 3, ny: -22, fx: 5, fy: -15, sa: -0.6, ffx: 6, ffy: 0, fa: 0.6, bfx: -4 })],
      [
        frame(2),
        y({
          hy: -14,
          cb: 0.5,
          nx: 3,
          ny: -24,
          fx: 4,
          fy: -16,
          sa: -0.45,
          ffx: 4,
          ffy: -3,
          fa: 0.5,
          bfx: -5,
          bfy: -2,
          ba: 0.3,
        }),
      ],
      [
        frame(4),
        y({
          hy: -14,
          cb: 0.5,
          nx: 3,
          ny: -24,
          fx: 4,
          fy: -16,
          sa: -0.45,
          ffx: 3,
          ffy: -3,
          fa: 0.4,
          bfx: -6,
          bfy: -1,
          ba: 0.1,
        }),
      ],
      [
        BACKSTEP_TIMES.land - 0.001,
        y({ hy: -13.5, nx: 3, ny: -23.5, fx: 4.5, fy: -16, sa: -0.5, ffx: 3, ffy: -1.5, bfx: -6, bfy: 0 }),
      ],
      [
        BACKSTEP_TIMES.land,
        y({ hx: -1, hy: -10.5, cb: 1, nx: 3, ny: -20.5, fx: 6, fy: -13, sa: -0.7, ffx: 6, bfx: -6, ba: 0.4 }),
        "snap",
      ],
      [
        BACKSTEP_TIMES.land + frame(2),
        y({ hx: -1, hy: -11.5, cb: 0.5, nx: 2.5, ny: -21.5, fx: 6, fy: -14.5, sa: -0.8, ffx: 6, bfx: -6, ba: 0.3 }),
      ],
      [BACKSTEP_TIMES.end, y({ hy: -12.5, nx: 2, ny: -22.5, fx: 6, fy: -15.5, sa: -0.85, ffx: 5.5, bfx: -5.5 })],
    ],
  },
  /** struck: the head snaps back, the haft is knocked up and away from her, the far hand loses it, then she pulls it back */
  hurt: {
    dur: 0.32,
    hit: 0,
    keys: [
      [0, y({ hx: -1, hy: -13, cb: -1.5, nx: -3, ny: -22, fx: 4, fy: -19, sa: -1.9, ffx: 5, ffy: -1, fa: 0.3 }, 6)],
      [
        frame(1),
        {
          ...y({
            hx: -1.5,
            hy: -13.5,
            cb: -2,
            nx: -4.5,
            ny: -22,
            fx: 3,
            fy: -21,
            sa: -2.3,
            ffx: 5,
            ffy: -2,
            fa: 0.5,
            bfy: -1,
          }),
          bx: -8,
          by: -19,
        },
      ],
      [
        frame(3),
        {
          ...y({
            hx: -1.5,
            hy: -14,
            cb: -1.5,
            nx: -4,
            ny: -23,
            fx: 2.5,
            fy: -22,
            sa: -2.45,
            ffx: 4.5,
            ffy: -3,
            fa: 0.5,
            bfx: -4,
            bfy: -2,
          }),
          bx: -8.5,
          by: -21,
        },
      ],
      [
        frame(5),
        {
          ...y({
            hx: -1,
            hy: -14,
            cb: -1,
            nx: -3,
            ny: -23.5,
            fx: 3,
            fy: -21.5,
            sa: -2.3,
            ffx: 4.5,
            ffy: -3,
            bfx: -4.5,
            bfy: -2,
          }),
          bx: -8,
          by: -20,
          be: 1,
        },
      ],
      [
        frame(7),
        {
          ...y({
            hy: -14,
            cb: -0.5,
            nx: -1.5,
            ny: -24,
            fx: 4,
            fy: -19,
            sa: -1.7,
            ffx: 4.5,
            ffy: -2,
            bfx: -4.5,
            bfy: -1.5,
          }),
          bx: -5,
          by: -18,
        },
      ],
      [
        frame(8),
        y({ hy: -14, nx: -0.5, ny: -24, fx: 5, fy: -17.5, sa: -1.3, ffx: 4.5, ffy: -2, bfx: -4.5, bfy: -1.5 }),
      ],
      [0.32, y({ hy: -13.5, nx: 1, ny: -23.5, fx: 6, fy: -16.5, sa: -0.95, ffx: 4.5, ffy: -1.5, bfx: -4.5, bfy: -1 })],
    ],
  },
} satisfies Record<string, ActionClip>;
