import type { ActionClip } from "../../../../types/pose";
import { frame } from "../../../hero";
import { GLAIVE_READY, held } from "../grip";

/**
 * The glaive string. Ysra keeps both hands on the haft and her feet set: each blow sinks or rises the whole body, winds
 * up long the other way, snaps out to the full length of the glaive and holds there before she draws it home.
 */
export const GLAIVE_STRING_CLIPS = {
  /** she rocks back onto the rear leg with the haft drawn to her hip, then drives it straight out from the hip in a
   *  wide, low spear stance, both arms long, and holds the line */
  yHipThrust: {
    dur: 0.5,
    hit: frame(6),
    keys: [
      [0, held({ hx: -1, hy: -13, nx: -0.5, ny: -23, fx: 4, fy: -15, sa: 0.25, ffx: 5, bfx: -5 })],
      [
        frame(2),
        held({
          hx: -2.5,
          hy: -11.5,
          cb: -1,
          nx: -3.5,
          ny: -21,
          fx: -1,
          fy: -14,
          sa: 0,
          ffx: 8,
          fa: -0.2,
          bfx: -8,
          ba: 0.3,
        }),
      ],
      [
        frame(4),
        held({
          hx: -3,
          hy: -10.5,
          cb: -1.5,
          nx: -5,
          ny: -20,
          fx: -3.5,
          fy: -13,
          sa: -0.06,
          ffx: 9,
          fa: -0.3,
          bfx: -8.5,
          ba: 0.4,
        }),
      ],
      [
        frame(5),
        held({
          hx: -3.5,
          hy: -10,
          cb: -1.5,
          nx: -5.5,
          ny: -19.5,
          fx: -4,
          fy: -12.5,
          sa: -0.08,
          ffx: 9,
          fa: -0.3,
          bfx: -9,
          ba: 0.4,
        }),
      ],
      [
        frame(6),
        held({ hx: 3, hy: -10, cb: 1, nx: 8, ny: -19, fx: 16, fy: -15, sa: 0, ffx: 12, bfx: -10, ba: 0.55 }, 6),
        "snap",
      ],
      [
        frame(7),
        held(
          { hx: 3.5, hy: -9.5, cb: 1, nx: 8.5, ny: -18.5, fx: 16.5, fy: -14.5, sa: 0.02, ffx: 12, bfx: -10, ba: 0.6 },
          6,
        ),
      ],
      [
        frame(9),
        held(
          { hx: 3.5, hy: -9.5, cb: 1, nx: 8.5, ny: -18.5, fx: 16.5, fy: -14.5, sa: 0.03, ffx: 12, bfx: -10, ba: 0.6 },
          6,
        ),
      ],
      [
        frame(10),
        held({ hx: 3, hy: -10, cb: 0.5, nx: 7.5, ny: -19.5, fx: 15, fy: -15, sa: 0.05, ffx: 12, bfx: -10, ba: 0.5 }, 6),
      ],
      [
        frame(11),
        held({ hx: 2, hy: -11, nx: 5.5, ny: -20.5, fx: 12, fy: -15.5, sa: 0.1, ffx: 10, bfx: -9, ba: 0.4 }, 6),
      ],
      [frame(12), held({ hx: 1, hy: -12, nx: 3.5, ny: -21.5, fx: 9, fy: -15.5, sa: 0.18, ffx: 8, bfx: -7.5, ba: 0.2 })],
      [frame(13), held({ hx: 0, hy: -12.5, nx: 1.5, ny: -22.5, fx: 7, fy: -15.5, sa: 0.25, ffx: 6.5, bfx: -6 })],
      [0.5, GLAIVE_READY],
    ],
  },
  /** she turns her back to us with the glaive trailing behind her, then unwinds into a flat sweep at the waist that
   *  carries across the whole front and on up over the far shoulder */
  yReverseSweep: {
    dur: 0.56,
    hit: frame(7),
    keys: [
      [0, GLAIVE_READY],
      [
        frame(2),
        held(
          { hx: -1, hy: -12.5, cb: -1, nx: -3, ny: -22, fx: -6, fy: -16, sa: 2.6, ffx: 6, bfx: -7, ba: 0.2, tw: 1 },
          -4,
        ),
      ],
      [
        frame(4),
        held(
          {
            hx: -2,
            hy: -11.5,
            cb: -1.5,
            nx: -4.5,
            ny: -21,
            fx: -9,
            fy: -15,
            sa: 2.9,
            ffx: 7,
            fa: -0.2,
            bfx: -8,
            ba: 0.3,
            tw: 1,
          },
          -4,
        ),
      ],
      [
        frame(6),
        held(
          {
            hx: -2.5,
            hy: -11,
            cb: -1.5,
            nx: -5,
            ny: -20.5,
            fx: -10,
            fy: -14.5,
            sa: 3,
            ffx: 7,
            fa: -0.2,
            bfx: -8.5,
            ba: 0.3,
            tw: 1,
          },
          -4,
        ),
      ],
      [
        frame(7),
        held({ hx: 2.5, hy: -11, cb: 1, nx: 6, ny: -20.5, fx: 15, fy: -16, sa: 0.05, ffx: 10, bfx: -8, ba: 0.6 }, 5),
        "snap",
      ],
      [
        frame(8),
        held(
          { hx: 3, hy: -11, cb: 1, nx: 6.5, ny: -20.5, fx: 15.5, fy: -16.5, sa: -0.05, ffx: 10, bfx: -8, ba: 0.6 },
          5,
        ),
      ],
      [
        frame(9),
        held(
          { hx: 3, hy: -11.5, cb: 1, nx: 6.5, ny: -21, fx: 15, fy: -17.5, sa: -0.15, ffx: 10, bfx: -8, ba: 0.55 },
          5,
        ),
      ],
      [
        frame(10),
        held(
          { hx: 2.5, hy: -12, cb: 0.5, nx: 5.5, ny: -21.5, fx: 13, fy: -20, sa: -0.45, ffx: 9.5, bfx: -8, ba: 0.4 },
          5,
        ),
      ],
      [
        frame(11),
        held({ hx: 2, hy: -12.5, nx: 4.5, ny: -22, fx: 10.5, fy: -23, sa: -0.85, ffx: 9, bfx: -7.5, ba: 0.3 }, 5),
      ],
      [
        frame(12),
        held({ hx: 1.5, hy: -13, nx: 3.5, ny: -22.5, fx: 8.5, fy: -24, sa: -1.05, ffx: 8, bfx: -7, ba: 0.2 }, 5),
      ],
      [frame(14), held({ hx: 0.5, hy: -13, nx: 1.5, ny: -23, fx: 7, fy: -20, sa: -0.4, ffx: 6.5, bfx: -6 })],
      [0.56, GLAIVE_READY],
    ],
  },
  /** up on her toes with the glaive lifted high over and behind her head, the whole body arched back, then folded deep
   *  over the front knee as the blade comes down into the floor at full reach, held there while the dust rises */
  yCleave: {
    dur: 0.62,
    hit: frame(8),
    keys: [
      [0, GLAIVE_READY],
      [
        frame(2),
        held({ hx: -0.5, hy: -14.5, cb: 0.5, nx: -1, ny: -24.5, fx: 3, fy: -28, sa: -1.3, ffx: 5, bfx: -5, ba: 0.2 }),
      ],
      [
        frame(4),
        held({
          hx: -1,
          hy: -15.5,
          cb: 1.5,
          nx: -2,
          ny: -25.5,
          fx: 1.5,
          fy: -33,
          sa: -1.95,
          ffx: 5,
          ffy: -1,
          fa: 0.5,
          bfx: -6,
          ba: 0.4,
        }),
      ],
      [
        frame(6),
        held({
          hx: -1.5,
          hy: -16,
          cb: 2,
          nx: -3,
          ny: -26,
          fx: 0.5,
          fy: -34,
          sa: -2.35,
          ffx: 5,
          ffy: -1.5,
          fa: 0.6,
          bfx: -6,
          ba: 0.5,
        }),
      ],
      [
        frame(7),
        held({
          hx: -1.5,
          hy: -16,
          cb: 2,
          nx: -3,
          ny: -26,
          fx: 0,
          fy: -34.5,
          sa: -2.45,
          ffx: 5,
          ffy: -1.5,
          fa: 0.6,
          bfx: -6,
          ba: 0.5,
        }),
      ],
      [
        frame(8),
        held({ hx: 2, hy: -9, cb: -1, nx: 9, ny: -16, fx: 13, fy: -10, sa: 0.5, ffx: 11, bfx: -9, ba: 0.6 }, 6),
        "snap",
      ],
      [
        frame(9),
        held(
          { hx: 2.5, hy: -8.5, cb: -1, nx: 9.5, ny: -15.5, fx: 13.5, fy: -9.5, sa: 0.52, ffx: 11, bfx: -9, ba: 0.65 },
          6,
        ),
      ],
      [
        frame(12),
        held(
          { hx: 2.5, hy: -8.5, cb: -1, nx: 9.5, ny: -15.5, fx: 13.5, fy: -9.5, sa: 0.52, ffx: 11, bfx: -9, ba: 0.65 },
          6,
        ),
      ],
      [
        frame(13),
        held({ hx: 2, hy: -9.5, cb: -0.5, nx: 8, ny: -17, fx: 12.5, fy: -11, sa: 0.45, ffx: 11, bfx: -9, ba: 0.55 }, 6),
      ],
      [
        frame(14),
        held({ hx: 1.5, hy: -10.5, nx: 6, ny: -19, fx: 11, fy: -13, sa: 0.38, ffx: 10, bfx: -8.5, ba: 0.4 }, 6),
      ],
      [frame(15), held({ hx: 1, hy: -11.5, nx: 4, ny: -21, fx: 9, fy: -14, sa: 0.34, ffx: 8, bfx: -7, ba: 0.2 })],
      [frame(17), held({ hx: 0, hy: -13, nx: 1, ny: -23, fx: 6, fy: -15, sa: 0.34, ffx: 6, bfx: -5.5 })],
      [0.62, GLAIVE_READY],
    ],
  },
  /** the glaive cocked up over the shoulder, then spun through a full wheel around her hands as her body turns with
   *  it: the blade cuts down in front, the turn shows her back, and the blade comes up behind her */
  yTwirl: {
    dur: 0.52,
    hit: frame(5),
    keys: [
      [0, GLAIVE_READY],
      [
        frame(2),
        held({ hx: -1, hy: -13.5, cb: -0.5, nx: -1.5, ny: -23.5, fx: 3, fy: -22, sa: -2, ffx: 6, bfx: -6 }, 3),
      ],
      [
        frame(3),
        held({ hx: -1.5, hy: -13, cb: -1, nx: -2, ny: -23, fx: 2.5, fy: -22.5, sa: -2.3, ffx: 6, bfx: -6, ba: 0.2 }, 3),
      ],
      [frame(4), held({ hx: 0, hy: -12.5, nx: 1.5, ny: -22.5, fx: 6, fy: -20, sa: -0.6, ffx: 7, bfx: -6, ba: 0.3 }, 3)],
      [
        frame(5),
        held({ hx: 1, hy: -12, cb: 0.5, nx: 3, ny: -22, fx: 8, fy: -18, sa: 0.55, ffx: 7, bfx: -6, ba: 0.4 }, 3),
        "snap",
      ],
      [
        frame(6),
        held({ hx: 1, hy: -12, cb: 0.5, nx: 3, ny: -22, fx: 7, fy: -22, sa: 1.2, ffx: 7, bfx: -6, ba: 0.4 }, 3),
      ],
      [
        frame(7),
        held({ hx: 0, hy: -12, nx: 0.5, ny: -22, fx: 2, fy: -22, sa: 2.1, ffx: 6.5, bfx: -6.5, ba: 0.3, tw: 1 }, 3),
      ],
      [
        frame(8),
        held({ hx: -1, hy: -12, nx: -1, ny: -22, fx: -2, fy: -19, sa: 2.8, ffx: 6.5, bfx: -7, ba: 0.3, tw: 1 }, 3),
      ],
      [
        frame(9),
        held(
          {
            hx: -1.5,
            hy: -12,
            cb: 0.5,
            nx: -2.5,
            ny: -22,
            fx: -5,
            fy: -19,
            sa: 3.6,
            ffx: 6.5,
            bfx: -7,
            ba: 0.4,
            tw: 1,
          },
          3,
        ),
        "snap",
      ],
      [
        frame(10),
        held(
          {
            hx: -1.5,
            hy: -12,
            cb: 0.5,
            nx: -2.5,
            ny: -22,
            fx: -5,
            fy: -19.5,
            sa: 4.0,
            ffx: 6.5,
            bfx: -7,
            ba: 0.4,
            tw: 1,
          },
          3,
        ),
      ],
      [
        frame(11),
        held({ hx: -1, hy: -12.5, nx: -1, ny: -22.5, fx: -1, fy: -21, sa: 4.5, ffx: 6, bfx: -6.5, ba: 0.3 }, 3),
      ],
      [frame(12), held({ hx: -0.5, hy: -13, nx: 0, ny: -23, fx: 3, fy: -20, sa: 5.4, ffx: 5.5, bfx: -6, ba: 0.2 }, 3)],
      [frame(14), held({ hx: 0, hy: -13.5, nx: 0.5, ny: -23.5, fx: 5, fy: -16, sa: 6.5, ffx: 5, bfx: -5 })],
      [0.52, { ...GLAIVE_READY, sa: GLAIVE_READY.sa + Math.PI * 2 }],
    ],
  },
  /** a foe at her back: she keeps her front, sinks onto the rear leg and drives the butt of the haft back past her hip,
   *  looking back over her shoulder, then rocks forward again */
  yHaftRam: {
    dur: 0.46,
    hit: frame(5),
    keys: [
      [0, GLAIVE_READY],
      [frame(2), held({ hx: 1, hy: -13, cb: 0.5, nx: 3, ny: -22.5, fx: 9, fy: -18, sa: -0.25, ffx: 6, bfx: -5 }, -5)],
      [
        frame(3),
        held({ hx: 1.5, hy: -12.5, cb: 1, nx: 4, ny: -22, fx: 10, fy: -19, sa: -0.3, ffx: 6, bfx: -5, ba: 0.2 }, -5),
      ],
      [
        frame(4),
        held(
          { hx: 2, hy: -12, cb: 1, nx: 4.5, ny: -21.5, fx: 10.5, fy: -19.5, sa: -0.32, ffx: 6, bfx: -5, ba: 0.3 },
          -5,
        ),
      ],
      [
        frame(5),
        held(
          { hx: -4, hy: -10.5, cb: -1, nx: -6, ny: -20, fx: -6, fy: -15, sa: -0.12, ffx: 5, fa: -0.3, bfx: -12, mr: 0 },
          -6,
        ),
        "snap",
      ],
      [
        frame(6),
        held(
          {
            hx: -4.5,
            hy: -10,
            cb: -1,
            nx: -6.5,
            ny: -19.5,
            fx: -6.5,
            fy: -14.5,
            sa: -0.12,
            ffx: 5,
            fa: -0.3,
            bfx: -12,
          },
          -6,
        ),
      ],
      [
        frame(8),
        held(
          { hx: -4.5, hy: -10, cb: -1, nx: -6.5, ny: -19.5, fx: -6.5, fy: -14.5, sa: -0.1, ffx: 5, fa: -0.3, bfx: -12 },
          -6,
        ),
      ],
      [
        frame(9),
        held(
          { hx: -3.5, hy: -11, cb: -0.5, nx: -5, ny: -20.5, fx: -4, fy: -15, sa: 0, ffx: 5, fa: -0.2, bfx: -11 },
          -6,
        ),
      ],
      [frame(10), held({ hx: -2, hy: -12, nx: -2.5, ny: -21.5, fx: 0, fy: -15.5, sa: 0.12, ffx: 5, bfx: -9 }, -2)],
      [frame(11), held({ hx: -1, hy: -12.5, nx: -1, ny: -22.5, fx: 3, fy: -15.5, sa: 0.25, ffx: 5, bfx: -7 })],
      [frame(12), held({ hx: -0.5, hy: -13, nx: 0, ny: -23, fx: 4.5, fy: -15, sa: 0.32, ffx: 5, bfx: -6 })],
      [0.46, GLAIVE_READY],
    ],
  },
  /** the string's last blow: a skip forward with the glaive raised overhead point down, then driven down at an angle
   *  through the foe into the floor, held there with her weight on it, and wrenched out */
  yImpale: {
    dur: 0.76,
    hit: frame(9),
    keys: [
      [0, GLAIVE_READY],
      [
        frame(2),
        held({ hx: -1, hy: -12, cb: -1, nx: -2, ny: -21.5, fx: 2, fy: -24, sa: 1.1, ffx: 6, bfx: -6, ba: 0.3 }, 5),
      ],
      [
        frame(4),
        held(
          {
            hx: 0,
            hy: -15.5,
            cb: 0.5,
            nx: 0,
            ny: -25.5,
            fx: 3,
            fy: -33,
            sa: 1.2,
            ffx: 5,
            ffy: -3,
            fa: 0.4,
            bfx: -6,
            bfy: -1,
            ba: 0.6,
          },
          6,
        ),
      ],
      [
        frame(6),
        held(
          {
            hx: 1,
            hy: -17,
            cb: 1,
            nx: 1.5,
            ny: -27,
            fx: 4,
            fy: -35,
            sa: 1.25,
            ffx: 6,
            ffy: -4,
            fa: 0.5,
            bfx: -5,
            bfy: -2,
            ba: 0.7,
          },
          6,
        ),
      ],
      [
        frame(8),
        held(
          {
            hx: 1,
            hy: -16,
            cb: 1,
            nx: 2,
            ny: -26,
            fx: 4,
            fy: -34.5,
            sa: 1.28,
            ffx: 7,
            ffy: -2,
            fa: 0.4,
            bfx: -6,
            bfy: -1,
            ba: 0.6,
          },
          6,
        ),
      ],
      [
        frame(9),
        held({ hx: 3, hy: -9, cb: -1, nx: 10, ny: -16.5, fx: 14, fy: -16, sa: 0.92, ffx: 12, bfx: -10, ba: 0.7 }, 7),
        "snap",
      ],
      [
        frame(10),
        held(
          { hx: 3.5, hy: -8.5, cb: -1, nx: 10.5, ny: -16, fx: 14.5, fy: -15.5, sa: 0.93, ffx: 12, bfx: -10, ba: 0.75 },
          7,
        ),
      ],
      [
        frame(14),
        held(
          { hx: 3.5, hy: -8.5, cb: -1, nx: 10.5, ny: -16, fx: 14.5, fy: -15.5, sa: 0.93, ffx: 12, bfx: -10, ba: 0.75 },
          7,
        ),
      ],
      [
        frame(15),
        held({ hx: 3, hy: -9, cb: -1.5, nx: 10, ny: -16.5, fx: 14, fy: -16, sa: 0.93, ffx: 12, bfx: -10, ba: 0.7 }, 7),
      ],
      [
        frame(16),
        held({ hx: 0.5, hy: -11, cb: -1, nx: 3, ny: -20.5, fx: 8, fy: -22, sa: 0.55, ffx: 12, bfx: -9, ba: 0.5 }, 6),
        "snap",
      ],
      [
        frame(17),
        held(
          { hx: 0.5, hy: -11.5, cb: -0.5, nx: 2.5, ny: -21, fx: 7.5, fy: -22.5, sa: 0.4, ffx: 11, bfx: -8.5, ba: 0.4 },
          6,
        ),
      ],
      [frame(19), held({ hx: 1, hy: -12.5, nx: 2.5, ny: -22.5, fx: 7.5, fy: -18, sa: 0.35, ffx: 9, bfx: -7, ba: 0.2 })],
      [frame(21), held({ hx: 0.5, hy: -13, nx: 1, ny: -23, fx: 6, fy: -15.5, sa: 0.35, ffx: 7, bfx: -5.5 })],
      [0.76, GLAIVE_READY],
    ],
  },
} satisfies Record<string, ActionClip>;
