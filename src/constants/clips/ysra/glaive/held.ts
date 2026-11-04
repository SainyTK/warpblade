import type { ActionClip, Pose } from "../../../../types/pose";
import { frame } from "../../../hero";
import { GLAIVE_READY, held } from "../grip";

/** the heft at full draw: coiled low over the rear leg, the haft pulled back past the hip and the point level */
const DRAWN: Pose = held({
  hx: -5,
  hy: -9,
  cb: -2,
  nx: -7.5,
  ny: -18.5,
  fx: -6.5,
  fy: -12,
  sa: -0.1,
  ffx: 10,
  fa: -0.4,
  bfx: -9.5,
  ba: 0.5,
});
/** the same draw, quivering a pixel lower while it holds */
const DRAWN_LOW: Pose = { ...DRAWN, hy: DRAWN.hy + 0.5, ny: DRAWN.ny + 0.5, fy: DRAWN.fy + 0.5, by: DRAWN.by + 0.5 };

/** the lunge stretched out: the body nearly flat behind the blade, the rear leg long, the front foot skimming */
const LUNGING: Pose = held(
  { hx: 4, hy: -8.5, cb: 1, nx: 13, ny: -15, fx: 19, fy: -14, sa: 0, ffx: 13, fa: -0.2, bfx: -13, ba: 0.9 },
  6,
);

/**
 * Heft: the clock of the held draw is the charge itself. The first 0.6 s draw the glaive back to the full heft, then
 * the last stretch quivers and repeats while J stays held.
 */
export const HEFT_CLIP: ActionClip = {
  dur: 0.9,
  hit: 0.6,
  keys: [
    [
      0,
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
      0.1,
      held({
        hx: -3.5,
        hy: -10,
        cb: -1.5,
        nx: -5.5,
        ny: -19.5,
        fx: -4.5,
        fy: -12.5,
        sa: -0.08,
        ffx: 9.5,
        fa: -0.3,
        bfx: -9,
        ba: 0.4,
      }),
    ],
    [
      0.25,
      held({
        hx: -4,
        hy: -9.5,
        cb: -2,
        nx: -6.5,
        ny: -19,
        fx: -5.5,
        fy: -12.5,
        sa: -0.09,
        ffx: 10,
        fa: -0.35,
        bfx: -9,
        ba: 0.45,
      }),
    ],
    [
      0.4,
      held({
        hx: -4.5,
        hy: -9.5,
        cb: -2,
        nx: -7,
        ny: -19,
        fx: -6,
        fy: -12,
        sa: -0.1,
        ffx: 10,
        fa: -0.4,
        bfx: -9.5,
        ba: 0.5,
      }),
    ],
    [0.6, DRAWN],
    [0.66, DRAWN_LOW],
    [0.73, DRAWN],
    [0.8, DRAWN_LOW],
    [0.86, DRAWN],
    [0.9, DRAWN],
  ],
};

/** the heft's two releases: a short poke straight back out, and the lunge that carries her through the line */
export const GLAIVE_HELD_CLIPS = {
  /** let go early: the drawn glaive snaps out half way from the hip, then she settles back into her guard */
  yPoke: {
    dur: 0.34,
    hit: frame(1),
    keys: [
      [0, DRAWN],
      [
        frame(1),
        held({ hx: 1, hy: -11, cb: 0.5, nx: 4.5, ny: -20.5, fx: 12.5, fy: -15, sa: 0, ffx: 9, bfx: -9, ba: 0.4 }, 6),
        "snap",
      ],
      [
        frame(2),
        held({ hx: 1.5, hy: -11, cb: 0.5, nx: 5, ny: -20.5, fx: 13, fy: -15, sa: 0.02, ffx: 9, bfx: -9, ba: 0.45 }, 6),
      ],
      [
        frame(3),
        held({ hx: 1.5, hy: -11, cb: 0.5, nx: 5, ny: -20.5, fx: 13, fy: -15, sa: 0.03, ffx: 9, bfx: -9, ba: 0.45 }, 6),
      ],
      [
        frame(4),
        held({ hx: 1, hy: -11.5, nx: 4, ny: -21, fx: 11.5, fy: -15.5, sa: 0.06, ffx: 8.5, bfx: -8.5, ba: 0.35 }, 6),
      ],
      [frame(5), held({ hx: 0.5, hy: -12, nx: 3, ny: -21.5, fx: 10, fy: -15.5, sa: 0.12, ffx: 8, bfx: -8, ba: 0.3 })],
      [frame(6), held({ hx: 0, hy: -12.5, nx: 2, ny: -22, fx: 8.5, fy: -15.5, sa: 0.18, ffx: 7, bfx: -7, ba: 0.2 })],
      [frame(7), held({ hx: 0, hy: -13, nx: 1.5, ny: -22.5, fx: 7.5, fy: -15.5, sa: 0.24, ffx: 6, bfx: -6 })],
      [frame(8), held({ hx: -0.5, hy: -13, nx: 1, ny: -23, fx: 6.5, fy: -15.5, sa: 0.3, ffx: 5.5, bfx: -5.5 })],
      [0.34, GLAIVE_READY],
    ],
  },
  /** the full release: she springs out of the draw flat behind the blade and skims along the floor, the rear foot
   *  dragging, then plants the front foot and draws herself up out of it */
  yLunge: {
    dur: 0.56,
    hit: frame(1),
    keys: [
      [0, DRAWN],
      [frame(1), LUNGING, "snap"],
      [frame(2), { ...LUNGING, bfy: -1, ba: 1 }],
      [frame(3), { ...LUNGING, hy: -9, ny: -15.5, bfy: -2, ba: 1.1 }],
      [frame(4), { ...LUNGING, bfy: -1, ba: 1 }],
      [frame(5), { ...LUNGING, hy: -9, ny: -15.5, bfy: -2, ba: 1.1 }],
      [frame(6), { ...LUNGING, bfy: -1, ba: 1 }],
      [
        frame(7),
        held({ hx: 4, hy: -8, cb: 1, nx: 12, ny: -15, fx: 18.5, fy: -14, sa: 0.02, ffx: 13, bfx: -12, ba: 0.8 }, 6),
      ],
      [
        frame(9),
        held(
          { hx: 3.5, hy: -8.5, cb: 0.5, nx: 11, ny: -16, fx: 17.5, fy: -14.5, sa: 0.04, ffx: 13, bfx: -11, ba: 0.7 },
          6,
        ),
      ],
      [frame(11), held({ hx: 2.5, hy: -10, nx: 7.5, ny: -19, fx: 14, fy: -15, sa: 0.1, ffx: 11, bfx: -9, ba: 0.5 }, 6)],
      [frame(13), held({ hx: 1, hy: -12, nx: 3.5, ny: -21.5, fx: 9.5, fy: -15.5, sa: 0.2, ffx: 8, bfx: -7, ba: 0.2 })],
      [frame(15), held({ hx: 0, hy: -13, nx: 1.5, ny: -23, fx: 7, fy: -15.5, sa: 0.3, ffx: 6, bfx: -5.5 })],
      [0.56, GLAIVE_READY],
    ],
  },
} satisfies Record<string, ActionClip>;
