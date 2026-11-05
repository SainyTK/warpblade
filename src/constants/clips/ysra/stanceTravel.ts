import type { ActionClip } from "../../../types/pose";
import { aimAt } from "../../../utils/glaiveGrip";
import { frame } from "../../hero";
import { CRASH, DIVE_TIMES, VAULT, VAULT_TIMES } from "../../ysra/stance";
import { y } from "./stanceBase";

/** the glaive aimed from the near hand at the point in the floor ahead, as she leaves it behind */
const AT_PLANT = (fx: number, fy: number, back = 0, up = 0): number => aimAt(fx, fy, VAULT.plantAhead - back, 1 + up);
const V = VAULT_TIMES;

/** Ysra's travel: the pole vault, the dive, and the vault crash out of a vault. */
export const STANCE_TRAVEL_CLIPS = {
  /**
   * The glaive hoisted, then stabbed point first into the floor ahead; she sinks onto it, springs, swings her legs up
   * past the haft and wrenches it free, tucks over the top swinging it round behind her, and comes down blade first
   * into a deep landing crouch.
   */
  vault: {
    dur: V.end,
    hit: V.launch,
    keys: [
      [0, y({ hy: -13.5, nx: 2, ny: -24, fx: 5, fy: -25, sa: -0.1, ffx: 4, bfx: -5 }, 7)],
      [frame(1), y({ hy: -14, nx: 2.5, ny: -24.5, fx: 4, fy: -28, sa: -0.35, ffx: 5, bfx: -5 }, 7)],
      [
        frame(2),
        y({ hy: -12.5, cb: 1, nx: 5, ny: -22, fx: 9, fy: -14, sa: AT_PLANT(9, -14), ffx: 8, fa: -0.2, bfx: -4 }, 7),
        "snap",
      ],
      [
        frame(3),
        y({ hy: -11, cb: 1, nx: 5, ny: -21, fx: 9, fy: -13, sa: AT_PLANT(9, -13), ffx: 8, bfx: -4, ba: 0.4 }, 7),
      ],
      [
        frame(4),
        y({ hy: -10, cb: 1.5, nx: 5.5, ny: -20, fx: 9, fy: -12, sa: AT_PLANT(9, -12), ffx: 7, bfx: -4, ba: 0.6 }, 7),
      ],
      [
        V.launch,
        y(
          {
            hy: -14,
            cb: 1,
            nx: 5,
            ny: -24,
            fx: 9,
            fy: -14,
            sa: AT_PLANT(9, -14),
            ffx: 4,
            ffy: 0,
            fa: 0.8,
            bfx: -3,
            ba: 0.8,
          },
          7,
        ),
      ],
      [
        V.launch + frame(1),
        y(
          {
            hy: -14,
            cb: 0.5,
            nx: 3.5,
            ny: -24,
            fx: 9,
            fy: -12,
            sa: AT_PLANT(9, -12, 4.5, 9.7),
            ffx: 7,
            ffy: -5,
            fa: 0.4,
            bfx: 3,
            bfy: -3,
            ba: 0.6,
          },
          7,
        ),
      ],
      [
        V.tuck,
        y(
          {
            hy: -16,
            cb: -1,
            nx: 1,
            ny: -25,
            fx: 5,
            fy: -16,
            sa: 2.1,
            ffx: 5,
            ffy: -9,
            fa: 0.3,
            bfx: 1,
            bfy: -8,
            ba: 0.4,
          },
          5,
        ),
        "snap",
      ],
      [
        V.tuck + frame(2),
        y(
          {
            hy: -16,
            cb: -1,
            nx: 0.5,
            ny: -25.5,
            fx: 3,
            fy: -20,
            sa: 3.0,
            ffx: 5,
            ffy: -10,
            fa: 0.3,
            bfx: 1,
            bfy: -9,
            ba: 0.4,
          },
          5,
        ),
      ],
      [
        V.tuck + frame(4),
        y(
          {
            hy: -16,
            cb: -1,
            nx: 0.5,
            ny: -26,
            fx: 3,
            fy: -26,
            sa: -2.5,
            ffx: 4.5,
            ffy: -10,
            fa: 0.3,
            bfx: 0.5,
            bfy: -9,
            ba: 0.4,
          },
          6,
        ),
      ],
      [
        V.tuck + frame(6),
        y(
          {
            hy: -16,
            cb: -0.5,
            nx: 1,
            ny: -26,
            fx: 4,
            fy: -28,
            sa: -1.6,
            ffx: 4.5,
            ffy: -9,
            fa: 0.3,
            bfx: 0,
            bfy: -8,
            ba: 0.4,
          },
          7,
        ),
      ],
      [
        V.tuck + frame(8),
        y(
          {
            hy: -15.5,
            nx: 1.5,
            ny: -25.5,
            fx: 6,
            fy: -26,
            sa: -0.4,
            ffx: 4.5,
            ffy: -7,
            fa: 0.3,
            bfx: -1.5,
            bfy: -6,
            ba: 0.4,
          },
          7,
        ),
      ],
      [
        V.tuck + frame(10),
        y(
          { hy: -15, nx: 2.5, ny: -25, fx: 8, fy: -20, sa: 0.5, ffx: 4.5, ffy: -4, fa: 0.4, bfx: -3, bfy: -3, ba: 0.5 },
          6,
        ),
      ],
      [
        V.land - 0.001,
        y(
          {
            hy: -15,
            nx: 2.5,
            ny: -25.5,
            fx: 8,
            fy: -18,
            sa: 0.75,
            ffx: 4.5,
            ffy: -1,
            fa: 0.5,
            bfx: -4.5,
            bfy: -1,
            ba: 0.5,
          },
          6,
        ),
      ],
      [
        V.land,
        y({ hx: -0.5, hy: -9.5, cb: 1.5, nx: 3.5, ny: -19, fx: 9, fy: -11, sa: 0.55, ffx: 6, bfx: -6, ba: 0.5 }, 6),
        "snap",
      ],
      [
        V.land + frame(2),
        y({ hx: -0.5, hy: -10, cb: 1, nx: 3, ny: -19.5, fx: 8.5, fy: -12, sa: 0.3, ffx: 6, bfx: -6, ba: 0.4 }, 6),
      ],
      [V.land + frame(5), y({ hy: -12, nx: 2, ny: -22, fx: 7, fy: -15, sa: -0.5, ffx: 5.5, bfx: -5.5, ba: 0.2 }, 6)],
      [V.end, y({})],
    ],
  },
  /**
   * The glaive swung up over her head as she hangs, then she points it down at 45 degrees and drops along it, legs
   * trailing; the point goes into the floor ahead of a deep crouch, and she wrenches it out.
   */
  dive: {
    dur: DIVE_TIMES.end,
    hit: DIVE_TIMES.impact,
    keys: [
      [0, y({ hy: -15, cb: -1, nx: 0, ny: -25, fx: 3, fy: -25, sa: -2.4, ffx: 4, ffy: -6, bfx: -2, bfy: -5 }, 6)],
      [
        frame(2),
        y({ hy: -15.5, cb: -1, nx: 0, ny: -25.5, fx: 4, fy: -29, sa: -1.5, ffx: 4, ffy: -7, bfx: -2, bfy: -6 }, 7),
      ],
      [
        DIVE_TIMES.drop,
        y(
          {
            hx: -1,
            hy: -15,
            cb: 1,
            nx: 4,
            ny: -23,
            fx: 9,
            fy: -16,
            sa: 0.8,
            ffx: -2,
            ffy: -4,
            fa: 0.6,
            bfx: -6,
            bfy: -7,
            ba: 0.7,
          },
          8,
        ),
        "snap",
      ],
      [
        DIVE_TIMES.drop + frame(1),
        y(
          {
            hx: -1,
            hy: -15,
            cb: 1.5,
            nx: 4.5,
            ny: -23,
            fx: 9.5,
            fy: -15.5,
            sa: 0.78,
            ffx: -3,
            ffy: -5,
            fa: 0.7,
            bfx: -7,
            bfy: -8,
            ba: 0.8,
          },
          8,
        ),
      ],
      [
        DIVE_TIMES.hold,
        y(
          {
            hx: -1,
            hy: -15,
            cb: 1.5,
            nx: 4.5,
            ny: -23,
            fx: 9.5,
            fy: -15.5,
            sa: 0.79,
            ffx: -3,
            ffy: -5.5,
            fa: 0.7,
            bfx: -7.5,
            bfy: -8,
            ba: 0.8,
          },
          8,
        ),
      ],
      [
        DIVE_TIMES.impact,
        y({ hx: 0, hy: -8.5, cb: 2, nx: 5, ny: -17.5, fx: 11, fy: -9, sa: 0.8, ffx: 6, bfx: -6, ba: 0.6 }, 8),
        "snap",
      ],
      [
        DIVE_TIMES.impact + frame(2),
        y({ hx: 0, hy: -8.5, cb: 2, nx: 5, ny: -17.5, fx: 11, fy: -9.5, sa: 0.82, ffx: 6, bfx: -6, ba: 0.6 }, 8),
      ],
      [
        DIVE_TIMES.impact + frame(4),
        y({ hy: -10, cb: 1, nx: 4, ny: -19.5, fx: 9, fy: -12, sa: 0.5, ffx: 6, bfx: -6, ba: 0.5 }, 7),
      ],
      [
        DIVE_TIMES.impact + frame(6),
        y({ hy: -12, nx: 2.5, ny: -22, fx: 7, fy: -15, sa: -0.3, ffx: 5.5, bfx: -5.5, ba: 0.2 }, 6),
      ],
      [DIVE_TIMES.end, y({})],
    ],
  },
  /**
   * Vault Strike: the glaive heaved overhead in both hands, turned point down and held there through the drop, then driven
   * into the floor at her feet with her whole weight; she holds it there a beat and tears it out.
   */
  yVaultCrash: {
    dur: CRASH.impactKey + frame(14),
    hit: CRASH.impactKey + frame(1),
    keys: [
      [0, y({ hy: -15, cb: -1, nx: 1, ny: -25, fx: 4, fy: -26, sa: -1.9, ffx: 4, ffy: -6, bfx: -2, bfy: -5 }, 6)],
      [
        CRASH.lift,
        y({ hy: -16, cb: -1.5, nx: 0.5, ny: -26, fx: 8, fy: -30, sa: 1.35, ffx: 4.5, ffy: -8, bfx: -1.5, bfy: -7 }, -6),
        "snap",
      ],
      [
        CRASH.lift + frame(2),
        y(
          { hy: -16, cb: -1.5, nx: 0.5, ny: -26, fx: 8, fy: -31, sa: 1.4, ffx: 4.5, ffy: -9, bfx: -1.5, bfy: -7.5 },
          -6,
        ),
      ],
      [
        CRASH.impactKey - 0.001,
        y({ hy: -16, cb: -1.5, nx: 1, ny: -26, fx: 8, fy: -30, sa: 1.4, ffx: 4.5, ffy: -9, bfx: -2, bfy: -8 }, -6),
      ],
      [
        CRASH.impactKey,
        y({ hy: -7.5, cb: 2, nx: 4, ny: -16.5, fx: 9, fy: -14, sa: 1.25, ffx: 6, bfx: -6, ba: 0.6 }, -5),
        "snap",
      ],
      [
        CRASH.impactKey + frame(1),
        y({ hy: -7, cb: 2, nx: 4, ny: -16, fx: 9, fy: -13, sa: 1.25, ffx: 6, bfx: -6, ba: 0.6 }, -5),
      ],
      [
        CRASH.impactKey + frame(6),
        y({ hy: -7.5, cb: 2, nx: 4, ny: -16.5, fx: 9, fy: -13.5, sa: 1.25, ffx: 6, bfx: -6, ba: 0.6 }, -5),
      ],
      [
        CRASH.impactKey + frame(8),
        y({ hy: -10, cb: 1, nx: 3, ny: -19.5, fx: 8, fy: -18, sa: 1.0, ffx: 6, bfx: -6, ba: 0.5 }, -5),
        "snap",
      ],
      [
        CRASH.impactKey + frame(11),
        y({ hy: -12, nx: 2, ny: -22, fx: 7, fy: -16, sa: -0.4, ffx: 5.5, bfx: -5.5, ba: 0.2 }, 6),
      ],
      [CRASH.impactKey + frame(14), y({})],
    ],
  },
} satisfies Record<string, ActionClip>;
