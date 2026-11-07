import type { ThrowKind } from "../../../types/hulda";
import type { ActionClip } from "../../../types/pose";
import { frame } from "../../hero";
import { CRUSH, GRAB, KNEE, SKYFALL, THROWS } from "../../hulda/grab";
import { AIR_LEGS, GUARD, g, HOLD_POSE } from "./stance";

/** her grab and what she does with a foe in her hands */
export const GRAPPLE_CLIPS = {
  /** both hands shoot out low and open, then pull back empty with a stagger forward on a whiff */
  grab: {
    dur: GRAB.dur,
    hit: GRAB.from,
    keys: [
      [0, GUARD],
      [frame(1), g({ nx: 0.5, hx: -1, fx: 5, fy: -18, bx: 3, by: -18 })],
      [frame(3), g({ nx: 4, ny: -21.5, hx: 0.5, cb: 1, fx: 14, fy: -17, bx: 13, by: -18, be: 0, ffx: 7, bfx: -5 })],
      [
        frame(5),
        g({ nx: 4.5, ny: -21, hx: 0.5, cb: 1, fx: 14.5, fy: -16.5, bx: 13.5, by: -17.5, be: 0, ffx: 7, bfx: -5 }),
      ],
      [frame(7), g({ nx: 3.5, ny: -21.5, hx: 0.5, fx: 11, fy: -17, bx: 9, by: -18.5, ffx: 7, bfx: -4 })],
      [frame(10), GUARD],
    ],
  },
  /** both hands close round a big foe, she leans in and squeezes */
  crush: {
    dur: CRUSH.dur,
    hit: CRUSH.hit,
    keys: [
      [0, g({ nx: 4, ny: -21.5, cb: 1, fx: 13, fy: -17, bx: 12, by: -18, be: 0, ffx: 7, bfx: -5 })],
      [frame(3), g({ nx: 3, ny: -22, cb: 0.5, fx: 13, fy: -21, bx: 12, by: -15, be: 0, ffx: 7, bfx: -5 })],
      [frame(5), g({ nx: 2.5, ny: -22.5, cb: 0, fx: 13.5, fy: -22, bx: 12.5, by: -14, be: 0, ffx: 7, bfx: -5 })],
      [frame(6), g({ nx: 5, ny: -21, cb: 1.5, fx: 11, fy: -19, bx: 11, by: -16, be: 0, ffx: 7, bfx: -6 }), "snap"],
      [frame(8), g({ nx: 4.5, ny: -21, cb: 1.5, fx: 11, fy: -19, bx: 11, by: -16.5, be: 0, ffx: 7, bfx: -6 })],
      [frame(12), GUARD],
    ],
  },
  /** the near knee drives up into the held foe as both hands pull it down onto it */
  knee: {
    dur: KNEE.dur,
    hit: KNEE.hit,
    keys: [
      [0, HOLD_POSE],
      [frame(2), g({ hx: -1, hy: -12.5, nx: 0, ny: -22.5, fx: 9, fy: -19, bx: 8, by: -20, be: 0, ffx: 3, ffy: -2 })],
      [
        frame(3),
        g({
          hx: 0.5,
          hy: -13,
          nx: 2,
          ny: -22,
          cb: 1,
          fx: 9,
          fy: -15,
          bx: 8,
          by: -16,
          be: 0,
          ffx: 7,
          ffy: -9,
          fa: -0.3,
        }),
        "snap",
      ],
      [
        frame(5),
        g({
          hx: 0.5,
          hy: -13,
          nx: 2,
          ny: -22,
          cb: 1,
          fx: 9,
          fy: -15.5,
          bx: 8,
          by: -16.5,
          be: 0,
          ffx: 6.5,
          ffy: -8,
          fa: -0.3,
        }),
      ],
      [frame(8), HOLD_POSE],
    ],
  },
  /** a lunge down and ahead with both hands out, the legs trailing; held until she lands, then the slam's crouch */
  skyfall: {
    dur: SKYFALL.lunge + SKYFALL.slamRecover,
    hit: SKYFALL.lunge,
    keys: [
      [0, g({ hy: -14, ny: -24, ...AIR_LEGS })],
      [frame(2), g({ hy: -14, nx: -0.5, ny: -24, cb: -0.5, fx: 4, fy: -26, bx: 2, by: -27, be: 0, ...AIR_LEGS })],
      [
        SKYFALL.lunge,
        g({
          hx: -1,
          hy: -15,
          nx: 5,
          ny: -21,
          cb: 1.5,
          fx: 13,
          fy: -12,
          bx: 12,
          by: -13,
          be: 0,
          ffx: -2,
          ffy: -4,
          fa: 0.6,
          bfx: -6,
          bfy: -2,
          ba: 0.6,
        }),
      ],
      [
        SKYFALL.lunge + frame(1),
        g({ hx: 0, hy: -8, nx: 5, ny: -17, cb: 1.5, fx: 11, fy: -3, bx: 10, by: -3, be: 0, ffx: 6, bfx: -6, ba: 1 }),
      ],
      [
        SKYFALL.lunge + frame(4),
        g({ hx: 0, hy: -8.5, nx: 4.5, ny: -17.5, cb: 1, fx: 10, fy: -4, bx: 9, by: -4, be: 0, ffx: 6, bfx: -6, ba: 1 }),
      ],
      [SKYFALL.lunge + frame(7), g({ hy: -11, nx: 3, ny: -21, fx: 8, fy: -15, bx: 6, by: -17 })],
      [SKYFALL.lunge + SKYFALL.slamRecover, GUARD],
    ],
  },
} satisfies Record<string, ActionClip>;

/** each throw from the hold: the foe crosses from the hold pose over two frames, so the throw reads from her hands */
export const THROW_CLIPS: Record<ThrowKind, ActionClip> = {
  /** the shoulders turn back with the foe, then whip round and let it go ahead */
  forward: {
    dur: THROWS.forward.dur,
    hit: THROWS.forward.release,
    keys: [
      [0, HOLD_POSE],
      [frame(2), g({ hx: -1.5, nx: -1, ny: -22, cb: -0.5, fx: 3, fy: -20, bx: 1, by: -21, be: 0, ffx: 6, bfx: -5 })],
      [frame(4), g({ hx: -2, nx: -2, ny: -22, cb: -1, fx: 0, fy: -21, bx: -1, by: -22, be: 0, ffx: 6, bfx: -5 })],
      [
        frame(5),
        g({ hx: 1, nx: 5, ny: -21.5, cb: 1.5, fx: 15, fy: -21, bx: 13, by: -22, be: 0, ffx: 8, bfx: -5, ba: 0.4 }),
        "snap",
      ],
      [
        frame(7),
        g({ hx: 1, nx: 4.5, ny: -21.5, cb: 1.5, fx: 14, fy: -19, bx: 12, by: -20, be: 0, ffx: 8, bfx: -5, ba: 0.4 }),
      ],
      [frame(10), g({ hx: 0.5, ffx: 6, bfx: -4 })],
    ],
  },
  /** lifted overhead on bent knees, an arch back that swings the foe over her head, the bridge as it hits, then up */
  suplex: {
    dur: THROWS.suplex.dur,
    hit: THROWS.suplex.slam,
    keys: [
      [0, HOLD_POSE],
      [frame(2), g({ hy: -10.5, ny: -20.5, nx: 1, fx: 8, fy: -14, bx: 7, by: -15, be: 0, ffx: 6, bfx: -6 })],
      [frame(5), g({ hy: -14, ny: -24.5, nx: 0.5, fx: 4, fy: -31, bx: 2, by: -32, be: 0, ffx: 5, bfx: -5 })],
      [
        frame(7),
        g({ hx: 1, hy: -14, ny: -23.5, nx: -3, cb: -1.5, fx: -3, fy: -30, bx: -4, by: -31, be: 0, ffx: 5, bfx: -4 }),
      ],
      [
        frame(9),
        g({ hx: 2, hy: -12.5, ny: -18, nx: -7, cb: -2, fx: -11, fy: -18, bx: -12, by: -19, be: 0, ffx: 5, bfx: -3 }),
      ],
      [
        frame(10),
        g({
          hx: 2.5,
          hy: -9,
          ny: -10,
          nx: -9,
          cb: -2,
          fx: -13,
          fy: -4,
          bx: -12,
          by: -4,
          be: 0,
          ffx: 5,
          bfx: -3,
          ba: 0.6,
        }),
        "snap",
      ],
      [
        frame(11),
        g({
          hx: 2.5,
          hy: -9,
          ny: -10.5,
          nx: -8.5,
          cb: -2,
          fx: -12.5,
          fy: -4.5,
          bx: -11.5,
          by: -4.5,
          be: 0,
          ffx: 5,
          bfx: -3,
          ba: 0.6,
        }),
      ],
      [frame(12), g({ hx: 1, hy: -9, ny: -17, nx: -4, cb: -1, fx: -4, fy: -10, bx: -5, by: -9, ffx: 5, bfx: -4 })],
      [frame(14), GUARD],
    ],
  },
  /** a dip under the foe, then she heaves it straight up with both arms */
  up: {
    dur: THROWS.up.dur,
    hit: THROWS.up.release,
    keys: [
      [0, HOLD_POSE],
      [frame(2), g({ hy: -11, ny: -21, nx: 1, fx: 8, fy: -14, bx: 7, by: -15, be: 0, ffx: 6, bfx: -6 })],
      [frame(4), g({ hy: -10.5, ny: -20.5, nx: 1, fx: 8, fy: -13, bx: 7, by: -14, be: 0, ffx: 6, bfx: -6 })],
      [
        frame(5),
        g({
          hy: -15,
          ny: -25.5,
          nx: 2,
          cb: 0.5,
          fx: 7,
          fy: -32,
          bx: 6,
          by: -32,
          be: 0,
          ffx: 5,
          ffy: 0,
          fa: -0.3,
          bfx: -5,
          ba: -0.3,
        }),
        "snap",
      ],
      [frame(7), g({ hy: -15, ny: -25.5, nx: 2, cb: 0.5, fx: 7, fy: -31, bx: 6, by: -31, be: 0, ffx: 5, bfx: -5 })],
      [frame(10), GUARD],
    ],
  },
  /** arms out at the held foe while she spins round twice, then the forward release */
  swing: {
    dur: THROWS.swing.dur,
    hit: THROWS.swing.release,
    keys: [
      [0, HOLD_POSE],
      [frame(2), g({ nx: -1, cb: -1, fx: 13, fy: -19, bx: 12, by: -20, be: 0, ffx: 4, bfx: -4 })],
      [frame(5), g({ nx: -1, cb: -1, fx: 13, fy: -19, bx: 12, by: -20, be: 0, ffx: 4, bfx: -4, tw: 1 })],
      [frame(7), g({ nx: -1, cb: -1, fx: 13, fy: -19, bx: 12, by: -20, be: 0, ffx: 4, bfx: -4, mr: 1 })],
      [frame(10), g({ nx: -1, cb: -1, fx: 13, fy: -19, bx: 12, by: -20, be: 0, ffx: 4, bfx: -4, mr: 1, tw: 1 })],
      [frame(12), g({ nx: -1, cb: -1, fx: 13, fy: -19, bx: 12, by: -20, be: 0, ffx: 4, bfx: -4 })],
      [frame(15), g({ nx: -1, cb: -1, fx: 13, fy: -19, bx: 12, by: -20, be: 0, ffx: 4, bfx: -4, tw: 1 })],
      [frame(17), g({ nx: -1, cb: -1, fx: 13, fy: -19, bx: 12, by: -20, be: 0, ffx: 4, bfx: -4, mr: 1 })],
      [frame(19), g({ nx: -1, cb: -1, fx: 13, fy: -19, bx: 12, by: -20, be: 0, ffx: 4, bfx: -4, mr: 1, tw: 1 })],
      [
        frame(20),
        g({ hx: 1, nx: 5, ny: -21.5, cb: 1.5, fx: 15, fy: -21, bx: 13, by: -22, be: 0, ffx: 8, bfx: -5, ba: 0.4 }),
        "snap",
      ],
      [
        frame(22),
        g({ hx: 1, nx: 4.5, ny: -21.5, cb: 1.5, fx: 14, fy: -19, bx: 12, by: -20, be: 0, ffx: 8, bfx: -5, ba: 0.4 }),
      ],
      [frame(24), g({ hx: 0.5, ffx: 6, bfx: -4 })],
    ],
  },
};
