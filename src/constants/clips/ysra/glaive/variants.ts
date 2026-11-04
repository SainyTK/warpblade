import type { ActionClip, Pose } from "../../../../types/pose";
import { frame } from "../../../hero";
import { GLAIVE_READY, held } from "../grip";

/** the windmill's glaive over her head, level, both hands up on the haft */
const overhead = (o: Partial<Pose>): Pose =>
  held({ hx: 0, hy: -14.5, nx: 0.5, ny: -25, fx: 5, fy: -35, sa: -0.08, ffx: 6, bfx: -6, ...o }, 5);

/** the warpath run: the glaive couched level under the arm, leaning into it, feet trading under her */
const couched = (o: Partial<Pose>): Pose =>
  held({ hx: 2, hy: -13, cb: 1, nx: 6, ny: -22, fx: 13, fy: -17, sa: 0.02, ...o }, 7);

/** the glaive's held-key and situational blows: Up, Down, the windmill, the counter and the running impale */
export const GLAIVE_VARIANT_CLIPS = {
  /** a deep crouch with the hook trailing low in front of her feet, then she springs up off the front foot and rips
   *  the hook up over her head, the rear leg kicked out behind */
  ySkyhook: {
    dur: 0.5,
    hit: frame(5),
    keys: [
      [0, GLAIVE_READY],
      [
        frame(2),
        held({ hx: -1, hy: -10, cb: -1, nx: 0, ny: -19.5, fx: 6, fy: -9, sa: 0.42, ffx: 7, bfx: -6, ba: 0.4 }, 5),
      ],
      [
        frame(3),
        held(
          {
            hx: -1.5,
            hy: -8.5,
            cb: -1.5,
            nx: 0,
            ny: -18,
            fx: 6,
            fy: -7.5,
            sa: 0.32,
            ffx: 7,
            fa: -0.2,
            bfx: -6,
            ba: 0.6,
          },
          5,
        ),
      ],
      [
        frame(4),
        held(
          {
            hx: -1.5,
            hy: -8,
            cb: -1.5,
            nx: 0,
            ny: -17.5,
            fx: 6.5,
            fy: -7,
            sa: 0.28,
            ffx: 7,
            fa: -0.2,
            bfx: -6,
            ba: 0.7,
          },
          5,
        ),
      ],
      [
        frame(5),
        held(
          {
            hx: 1,
            hy: -16,
            cb: 2,
            nx: 2,
            ny: -26,
            fx: 7,
            fy: -34,
            sa: -1.25,
            ffx: 2,
            fa: 0.6,
            bfx: -6,
            bfy: -5,
            ba: 0.8,
          },
          6,
        ),
        "snap",
      ],
      [
        frame(6),
        held(
          {
            hx: 1,
            hy: -16.5,
            cb: 2,
            nx: 2,
            ny: -26.5,
            fx: 6.5,
            fy: -34.5,
            sa: -1.35,
            ffx: 2,
            fa: 0.6,
            bfx: -6,
            bfy: -5.5,
            ba: 0.8,
          },
          6,
        ),
      ],
      [
        frame(7),
        held(
          {
            hx: 1,
            hy: -16.5,
            cb: 1.5,
            nx: 1.5,
            ny: -26.5,
            fx: 6,
            fy: -34.5,
            sa: -1.45,
            ffx: 2.5,
            ffy: -1,
            fa: 0.6,
            bfx: -5.5,
            bfy: -5,
            ba: 0.8,
          },
          6,
        ),
      ],
      [
        frame(9),
        held(
          {
            hx: 0.5,
            hy: -16,
            cb: 1,
            nx: 1,
            ny: -26,
            fx: 5,
            fy: -33,
            sa: -1.6,
            ffx: 3,
            ffy: -2,
            fa: 0.5,
            bfx: -5,
            bfy: -4,
            ba: 0.7,
          },
          6,
        ),
      ],
      [
        frame(11),
        held(
          {
            hx: 0,
            hy: -15,
            cb: 0.5,
            nx: 0.5,
            ny: -25,
            fx: 5,
            fy: -29,
            sa: -1.2,
            ffx: 4,
            ffy: -2,
            fa: 0.4,
            bfx: -5,
            bfy: -3,
            ba: 0.5,
          },
          5,
        ),
      ],
      [
        frame(13),
        held({
          hx: 0,
          hy: -14.5,
          nx: 0.5,
          ny: -24.5,
          fx: 6,
          fy: -23,
          sa: -0.5,
          ffx: 4.5,
          ffy: -1,
          fa: 0.2,
          bfx: -5,
          bfy: -1.5,
          ba: 0.3,
        }),
      ],
      [0.5, GLAIVE_READY],
    ],
  },
  /** down on the rear knee with the glaive laid long and low along the floor, the hook set behind the foe's feet,
   *  then hauled back hand over hand toward her hip */
  yLash: {
    dur: 0.56,
    hit: frame(6),
    keys: [
      [0, GLAIVE_READY],
      [
        frame(2),
        held({ hx: 1, hy: -10, cb: 0.5, nx: 4, ny: -19, fx: 11, fy: -9, sa: 0.3, ffx: 9, bfx: -6, bfy: 0, ba: 0.8 }, 6),
      ],
      [
        frame(3),
        held({ hx: 1.5, hy: -7.5, cb: 1, nx: 6, ny: -16.5, fx: 14, fy: -6, sa: 0.15, ffx: 10, bfx: -6, ba: 1.2 }, 6),
      ],
      [
        frame(4),
        held({ hx: 2, hy: -7, cb: 1, nx: 7, ny: -16, fx: 15, fy: -5.5, sa: 0.12, ffx: 10, bfx: -6, ba: 1.3 }, 6),
      ],
      [
        frame(5),
        held({ hx: 2, hy: -7, cb: 1, nx: 7, ny: -16, fx: 15.5, fy: -5, sa: 0.18, ffx: 10, bfx: -6, ba: 1.3 }, 6),
      ],
      [
        frame(6),
        held(
          { hx: -1, hy: -7.5, cb: -1, nx: -1, ny: -17, fx: 6, fy: -7, sa: 0.12, ffx: 10, fa: -0.3, bfx: -6, ba: 1.3 },
          6,
        ),
        "snap",
      ],
      [
        frame(7),
        held(
          {
            hx: -1.5,
            hy: -7.5,
            cb: -1.5,
            nx: -2,
            ny: -17,
            fx: 4,
            fy: -7.5,
            sa: 0.1,
            ffx: 10,
            fa: -0.3,
            bfx: -6,
            ba: 1.3,
          },
          6,
        ),
      ],
      [
        frame(9),
        held(
          { hx: -2, hy: -8, cb: -1.5, nx: -3, ny: -17.5, fx: 2, fy: -8, sa: 0.12, ffx: 10, fa: -0.3, bfx: -6, ba: 1.2 },
          5,
        ),
      ],
      [
        frame(11),
        held(
          {
            hx: -1.5,
            hy: -10,
            cb: -1,
            nx: -2,
            ny: -19.5,
            fx: 3,
            fy: -11,
            sa: 0.25,
            ffx: 8,
            fa: -0.1,
            bfx: -6,
            ba: 0.6,
          },
          5,
        ),
      ],
      [frame(13), held({ hx: -1, hy: -12, nx: -0.5, ny: -22, fx: 5, fy: -14, sa: 0.32, ffx: 6, bfx: -5.5, ba: 0.2 })],
      [0.56, GLAIVE_READY],
    ],
  },
  /** arms up and the glaive level over her head, she spins on the spot twice: the blade passes in front, her back
   *  turns, the blade passes behind, and round again, each pass a blow */
  yWindmill: {
    dur: 0.8,
    hit: frame(4),
    keys: [
      [0, GLAIVE_READY],
      [frame(2), overhead({ hy: -14, fx: 3, fy: -31, sa: -0.4 })],
      [frame(4), overhead({ fx: 7, sa: 0.05 }), "snap"],
      [frame(6), overhead({ tw: 1, fx: 2, sa: 0.05 })],
      [frame(8), overhead({ mr: 1, fx: 7, sa: 0.05 }), "snap"],
      [frame(10), overhead({ mr: 1, tw: 1, fx: 2, sa: 0.05 })],
      [frame(12), overhead({ fx: 7, sa: 0.05 }), "snap"],
      [frame(14), overhead({ tw: 1, fx: 2, sa: 0.05 })],
      [frame(16), overhead({ mr: 1, fx: 7, sa: 0.05 }), "snap"],
      [frame(18), overhead({ mr: 1, tw: 1, fx: 2, sa: 0.05 })],
      [frame(20), overhead({ fx: 6, fy: -31, sa: 0.2 })],
      [frame(22), held({ hx: -0.5, hy: -13.5, nx: 0.5, ny: -23.5, fx: 6, fy: -20, sa: 0.3, ffx: 5.5, bfx: -5.5 })],
      [0.8, GLAIVE_READY],
    ],
  },
  /** out of the parry: a crouch behind the glaive, then the deepest thrust she has, body flat and both arms long,
   *  held while the foe flies off the point */
  yCounter: {
    dur: 0.5,
    hit: frame(2),
    keys: [
      [0, held({ hx: -2, hy: -11, cb: -1, nx: -3, ny: -20.5, fx: 1, fy: -16, sa: -0.15, ffx: 7, bfx: -7, ba: 0.3 })],
      [
        frame(1),
        held({
          hx: -3,
          hy: -10,
          cb: -1.5,
          nx: -5,
          ny: -19.5,
          fx: -3,
          fy: -14,
          sa: -0.1,
          ffx: 8,
          fa: -0.3,
          bfx: -8,
          ba: 0.4,
        }),
      ],
      [
        frame(2),
        held(
          { hx: 5, hy: -8, cb: 1, nx: 15, ny: -13.5, fx: 21, fy: -13, sa: -0.02, ffx: 14, fa: -0.2, bfx: -12, ba: 1 },
          6,
        ),
        "snap",
      ],
      [
        frame(3),
        held(
          {
            hx: 5.5,
            hy: -8,
            cb: 1,
            nx: 15.5,
            ny: -13.5,
            fx: 21.5,
            fy: -13,
            sa: -0.02,
            ffx: 14,
            fa: -0.2,
            bfx: -12,
            ba: 1,
          },
          6,
        ),
      ],
      [
        frame(6),
        held(
          {
            hx: 5.5,
            hy: -8,
            cb: 1,
            nx: 15.5,
            ny: -13.5,
            fx: 21.5,
            fy: -13,
            sa: -0.03,
            ffx: 14,
            fa: -0.2,
            bfx: -12,
            ba: 1,
          },
          6,
        ),
      ],
      [
        frame(7),
        held({ hx: 5, hy: -8.5, cb: 0.5, nx: 14, ny: -14.5, fx: 20, fy: -13.5, sa: 0, ffx: 14, bfx: -12, ba: 0.9 }, 6),
      ],
      [
        frame(8),
        held({ hx: 4, hy: -9.5, nx: 11, ny: -17, fx: 17, fy: -14.5, sa: 0.05, ffx: 13, bfx: -11, ba: 0.7 }, 6),
      ],
      [frame(10), held({ hx: 2.5, hy: -11, nx: 7, ny: -20, fx: 13, fy: -15, sa: 0.15, ffx: 11, bfx: -9, ba: 0.5 }, 6)],
      [frame(12), held({ hx: 1, hy: -12.5, nx: 3, ny: -22, fx: 9, fy: -15.5, sa: 0.25, ffx: 8, bfx: -7, ba: 0.2 })],
      [frame(14), held({ hx: 0, hy: -13, nx: 1, ny: -23, fx: 7, fy: -15.5, sa: 0.32, ffx: 6, bfx: -5.5 })],
      [0.5, GLAIVE_READY],
    ],
  },
  /** at a charge, the glaive couched level under her arm and the body leaning into it, the feet still running, then
   *  the last stride stamps down and she drives the point on through */
  yRunImpale: {
    dur: 0.5,
    hit: frame(3),
    keys: [
      [0, couched({ ffx: 6, ffy: -2, fa: 0.3, bfx: -6, bfy: -1, ba: 0.6 })],
      [frame(1), couched({ hy: -12, ffx: 3, ffy: 0, bfx: -3, bfy: -3, ba: 0.8 })],
      [frame(2), couched({ ffx: -4, ffy: -1, fa: 0.4, bfx: 6, bfy: -2, ba: 0.3 })],
      [frame(3), couched({ hy: -11, nx: 9, ny: -20, fx: 17, fy: -16, ffx: 10, bfx: -9, ba: 0.7 }), "snap"],
      [frame(4), couched({ hy: -11, nx: 9.5, ny: -20, fx: 17.5, fy: -16, ffx: 10, bfx: -9, ba: 0.7 })],
      [frame(5), couched({ hy: -12, nx: 8, ny: -21, fx: 16, ffx: 5, ffy: -2, fa: 0.3, bfx: -6, bfy: -1, ba: 0.6 })],
      [frame(6), couched({ hy: -11, nx: 9.5, ny: -20, fx: 18, fy: -16, ffx: 11, bfx: -9, ba: 0.7 })],
      [frame(7), couched({ hy: -11, nx: 9.5, ny: -20, fx: 18, fy: -16, ffx: 11, bfx: -9.5, ba: 0.8 })],
      [frame(9), couched({ hy: -11, nx: 8.5, ny: -20.5, fx: 16.5, fy: -16, ffx: 10.5, bfx: -9, ba: 0.6 })],
      [frame(11), held({ hx: 1, hy: -12, nx: 4, ny: -21.5, fx: 11, fy: -16, sa: 0.12, ffx: 8, bfx: -7, ba: 0.3 })],
      [frame(13), held({ hx: 0, hy: -13, nx: 1.5, ny: -23, fx: 7, fy: -15.5, sa: 0.28, ffx: 6, bfx: -5.5 })],
      [0.5, GLAIVE_READY],
    ],
  },
} satisfies Record<string, ActionClip>;
