import type { ActionClip } from "../../../../types/pose";
import { frame } from "../../../hero";
import { GLAIVE_READY, held } from "../grip";

/**
 * The glaive string. Ysra keeps both hands on the haft and her feet set: each blow sinks or rises the whole body, winds
 * up long the other way and holds the coil for three frames or more, snaps out to the full length of the glaive past
 * the mark, holds there while the hit lands, then carries through onto the front foot before she draws it home. The
 * three blows read apart at a glance: level from the hip, rising from low behind to over her head, and driven down
 * from overhead.
 */
export const GLAIVE_STRING_CLIPS = {
  /** she rocks back onto the rear leg with the haft drawn to her hip and coils there, then drives it straight out from
   *  the hip in a wide, low spear stance, both arms long, past the mark and back, and the weight rolls onto the front
   *  foot as the point dips */
  yHipThrust: {
    dur: frame(15),
    hit: frame(6),
    keys: [
      [0, GLAIVE_READY],
      [
        frame(2),
        held({
          hx: -2,
          hy: -12,
          cb: -1,
          nx: -3,
          ny: -21.5,
          fx: 0,
          fy: -14.5,
          sa: 0.05,
          ffx: 7,
          fa: -0.15,
          bfx: -7.5,
          ba: 0.25,
        }),
      ],
      [
        frame(3),
        held({
          hx: -3.5,
          hy: -10.5,
          cb: -1.5,
          nx: -5.5,
          ny: -20,
          fx: -4,
          fy: -13,
          sa: -0.06,
          ffx: 9,
          fa: -0.3,
          bfx: -9,
          ba: 0.4,
        }),
      ],
      [
        frame(5),
        held({
          hx: -4,
          hy: -10,
          cb: -2,
          nx: -6,
          ny: -19.5,
          fx: -5,
          fy: -12.5,
          sa: -0.08,
          ffx: 9,
          fa: -0.3,
          bfx: -9,
          ba: 0.45,
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
          { hx: 3.5, hy: -9.5, cb: 1.5, nx: 9, ny: -18.5, fx: 17.5, fy: -14.5, sa: 0.02, ffx: 12, bfx: -10, ba: 0.6 },
          6,
        ),
      ],
      [
        frame(9),
        held(
          { hx: 3.5, hy: -9.5, cb: 1, nx: 8.5, ny: -18.5, fx: 16.5, fy: -14.5, sa: 0.04, ffx: 12, bfx: -10, ba: 0.6 },
          6,
        ),
      ],
      [
        frame(11),
        held(
          { hx: 4, hy: -10, cb: 1.5, nx: 8, ny: -19.5, fx: 14.5, fy: -13.5, sa: 0.14, ffx: 12, bfx: -9, ba: 0.5 },
          6,
        ),
      ],
      [
        frame(13),
        held({ hx: 1.5, hy: -12, cb: 0.5, nx: 4, ny: -21.5, fx: 10, fy: -15, sa: 0.25, ffx: 9, bfx: -7, ba: 0.25 }),
      ],
      [frame(15), GLAIVE_READY],
    ],
  },
  /** she sinks low and turns her back to us with the glaive trailing down behind her, coils there, then unwinds up
   *  out of the crouch into a sweep that rises across the front to high over her head, up on the back toe, and carries
   *  on over the far shoulder before it comes down to guard */
  yReverseSweep: {
    dur: frame(18),
    hit: frame(9),
    keys: [
      [0, GLAIVE_READY],
      [
        frame(2),
        held(
          { hx: -1, hy: -12.5, cb: -1, nx: -3, ny: -22, fx: -4, fy: -15, sa: 2.4, ffx: 6, bfx: -7, ba: 0.2, tw: 1 },
          -4,
        ),
      ],
      [
        frame(4),
        held(
          {
            hx: -2,
            hy: -11,
            cb: -1.5,
            nx: -5,
            ny: -20.5,
            fx: -8,
            fy: -13.5,
            sa: 2.75,
            ffx: 7.5,
            fa: -0.2,
            bfx: -8.5,
            ba: 0.35,
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
            hy: -10,
            cb: -2,
            nx: -5.5,
            ny: -19.5,
            fx: -10,
            fy: -12,
            sa: 2.85,
            ffx: 8,
            fa: -0.25,
            bfx: -9,
            ba: 0.4,
            tw: 1,
          },
          -4,
        ),
      ],
      [
        frame(8),
        held(
          {
            hx: -2.5,
            hy: -10,
            cb: -2,
            nx: -5.5,
            ny: -19.5,
            fx: -10.5,
            fy: -11.5,
            sa: 2.9,
            ffx: 8,
            fa: -0.25,
            bfx: -9,
            ba: 0.45,
            tw: 1,
          },
          -4,
        ),
      ],
      [
        frame(9),
        held({ hx: 2, hy: -13, cb: 1.5, nx: 4.5, ny: -23.5, fx: 10, fy: -24, sa: -0.95, ffx: 9, bfx: -8, ba: 0.5 }, 5),
        "snap",
      ],
      [
        frame(10),
        held(
          { hx: 2.5, hy: -13.5, cb: 2, nx: 5, ny: -24, fx: 10.5, fy: -25.5, sa: -1.1, ffx: 9, bfx: -8, ba: 0.55 },
          5,
        ),
      ],
      [
        frame(12),
        held({ hx: 2.5, hy: -13.5, cb: 1.5, nx: 5, ny: -24, fx: 10, fy: -25, sa: -1.05, ffx: 9, bfx: -8, ba: 0.55 }, 5),
      ],
      [
        frame(14),
        held({ hx: 3, hy: -13, cb: 1, nx: 5, ny: -23, fx: 7, fy: -26, sa: -1.5, ffx: 9, bfx: -7.5, ba: 0.45 }, 5),
      ],
      [
        frame(16),
        held({ hx: 1, hy: -13, cb: 0.5, nx: 2.5, ny: -23, fx: 7, fy: -19, sa: -0.4, ffx: 7, bfx: -6.5, ba: 0.2 }),
      ],
      [frame(18), GLAIVE_READY],
    ],
  },
  /** the string's last blow: a skip forward with the glaive raised overhead point down, a coil on the toes with the
   *  back arched, then driven down at an angle through the foe into the floor, the body folded over it past the mark,
   *  held there with her weight on it, and drawn up to come home */
  yImpale: {
    dur: frame(14),
    hit: frame(9),
    keys: [
      [0, GLAIVE_READY],
      [
        frame(2),
        held({ hx: -0.5, hy: -13, cb: -0.5, nx: -1, ny: -23, fx: 3, fy: -28, sa: 1.15, ffx: 5.5, bfx: -6, ba: 0.3 }, 5),
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
          { hx: 0.5, hy: -16, cb: 1.5, nx: 1, ny: -26, fx: 3.5, fy: -35.5, sa: 1.3, ffx: 7, fa: 0.1, bfx: -6, ba: 0.5 },
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
          { hx: 3.5, hy: -8, cb: -1.5, nx: 11, ny: -15.5, fx: 15, fy: -14.5, sa: 0.95, ffx: 12, bfx: -10, ba: 0.75 },
          7,
        ),
      ],
      [
        frame(12),
        held(
          { hx: 3.5, hy: -8.5, cb: -1, nx: 10.5, ny: -16, fx: 14.5, fy: -15, sa: 0.93, ffx: 12, bfx: -10, ba: 0.75 },
          7,
        ),
      ],
      [
        frame(14),
        held({ hx: 2, hy: -10.5, cb: -0.5, nx: 6, ny: -19.5, fx: 11, fy: -18, sa: 0.7, ffx: 11, bfx: -9, ba: 0.5 }, 6),
      ],
    ],
  },
} satisfies Record<string, ActionClip>;
