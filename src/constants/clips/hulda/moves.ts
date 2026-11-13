import type { ActionClip } from "../../../types/pose";
import { frame } from "../../hero";
import { BELLOW } from "../../hulda/bellow";
import { RUSH } from "../../hulda/rush";
import { TAUNT } from "../../hulda/taunt";
import { QUAKE } from "../../hulda/ultimates";
import { ULT_LOCK } from "../../ultimate";
import { CHARGE_POSE, GUARD, g } from "./stance";

const RUN_END = RUSH.load + RUSH.time;
/** her shoulder dropped into the charge, the head tucked behind it */
const RUSH_LEAN = g({ hx: 0, hy: -12.5, nx: 5, ny: -20.5, cb: 1.5, fx: 9, fy: -18, bx: 6, by: -19, fe: 1, be: 0 });

/** her own action clips beside the string and the grapple */
export const HULDA_CLIPS = {
  /** the load digs in and drops the shoulder, the charge pumps the legs under a fixed lean, the skid leans back */
  rush: {
    dur: RUN_END + RUSH.recover,
    hit: RUSH.load,
    keys: [
      [0, GUARD],
      [frame(1), g({ hy: -11.5, nx: 0.5, ny: -21, cb: 1, fx: 5, fy: -19, bx: 3, by: -20, ffx: 4, bfx: -6 })],
      [RUSH.load, g({ hy: -11.5, nx: 1, ny: -21, cb: 1, fx: 5, fy: -19, bx: 3, by: -20, ffx: 4, bfx: -6 })],
      [RUSH.load + RUSH.stride[0], { ...RUSH_LEAN, ffx: 7, ffy: -3, fa: 0.2, bfx: -6, ba: 0.4 }],
      [RUSH.load + RUSH.midStride, { ...RUSH_LEAN, ffx: 2, bfx: -2, bfy: -3, ba: 0.6 }],
      [RUSH.load + RUSH.stride[1], { ...RUSH_LEAN, ffx: 7, ffy: -3, fa: 0.2, bfx: -6, ba: 0.4 }],
      [RUN_END - RUSH.lastKey, { ...RUSH_LEAN, ffx: 2, bfx: -2, bfy: -3, ba: 0.6 }],
      [RUN_END + frame(1), g({ hx: -1.5, hy: -11.5, nx: -1, ny: -21.5, cb: -0.5, ffx: 8, fa: -0.3, bfx: -4 })],
      [RUN_END + frame(3), g({ hx: -1, hy: -12, nx: 0, ny: -22, ffx: 7, fa: -0.2, bfx: -4 })],
      [RUN_END + RUSH.recover, GUARD],
    ],
  },
  /** she draws breath and rears back, roars with her fists out low, and holds it */
  bellow: {
    dur: BELLOW.dur,
    hit: BELLOW.roar,
    keys: [
      [0, GUARD],
      [frame(2), g({ nx: -0.5, ny: -23, cb: -0.5, fx: 4, fy: -18, bx: 1, by: -18 })],
      [frame(4), g({ nx: -2, ny: -23.5, cb: -1, hx: -1, fx: 2, fy: -18, bx: -3, by: -18, be: 0 })],
      [
        frame(5),
        g({ nx: 3.5, ny: -22.5, cb: 1.5, hx: 0.5, fx: 10, fy: -12, bx: 9, by: -13, be: 0, ffx: 6, bfx: -6 }),
        "snap",
      ],
      [
        frame(9),
        g({ nx: 3.5, ny: -22.5, cb: 1.5, hx: 0.5, fx: 10, fy: -12.5, bx: 9, by: -13.5, be: 0, ffx: 6, bfx: -6 }),
      ],
      [BELLOW.dur, g({ nx: 2.5, cb: 1, fx: 8, fy: -16, bx: 6, by: -17 })],
    ],
  },
  /** upright and proud, she lifts the near fist and slaps it on her chest twice */
  taunt: {
    dur: TAUNT.dur,
    hit: TAUNT.beats[0],
    keys: [
      [0, GUARD],
      [frame(3), g({ hy: -13.5, ny: -24, nx: 0.5, cb: 1.5, fx: 9, fy: -25, bx: 3, by: -16, be: 0, ffx: 4, bfx: -4 })],
      [frame(5), g({ hy: -13.5, ny: -24, nx: 0.5, cb: 1.5, fx: 9, fy: -26, bx: 3, by: -16, be: 0, ffx: 4, bfx: -4 })],
      [
        TAUNT.beats[0],
        g({ hy: -13.5, ny: -24, nx: 0, cb: 2, fx: 4, fy: -21, bx: 3, by: -16, be: 0, ffx: 4, bfx: -4 }),
        "snap",
      ],
      [frame(9), g({ hy: -13.5, ny: -24, nx: 0.5, cb: 1.5, fx: 6, fy: -22, bx: 3, by: -16, be: 0, ffx: 4, bfx: -4 })],
      [frame(12), g({ hy: -13.5, ny: -24, nx: 0.5, cb: 1.5, fx: 9, fy: -26, bx: 3, by: -16, be: 0, ffx: 4, bfx: -4 })],
      [
        TAUNT.beats[1],
        g({ hy: -13.5, ny: -24, nx: 0, cb: 2, fx: 4, fy: -21, bx: 3, by: -16, be: 0, ffx: 4, bfx: -4 }),
        "snap",
      ],
      [frame(17), g({ hy: -13.5, ny: -24, nx: 0.5, cb: 1.5, fx: 6, fy: -21, bx: 3, by: -16, be: 0, ffx: 4, bfx: -4 })],
      [TAUNT.dur, GUARD],
    ],
  },
  /** Quake Drop: a hop with both fists raised high, then down onto the floor with her whole weight, and kneeling */
  quake: {
    dur: ULT_LOCK,
    hit: QUAKE.slam,
    keys: [
      [0, CHARGE_POSE],
      [frame(2), g({ hy: -11, ny: -21.5, nx: 1, fx: 4, fy: -24, bx: 2, by: -25, be: 0, ffx: 6, bfx: -6 })],
      [
        frame(4),
        g({
          hy: -19,
          ny: -29.5,
          nx: 0.5,
          cb: -0.5,
          fx: 3,
          fy: -40,
          bx: 1,
          by: -40,
          be: 0,
          ffx: 4,
          ffy: -6,
          fa: 0.4,
          bfx: -4,
          bfy: -5,
          ba: 0.5,
        }),
      ],
      [
        frame(6),
        g({
          hy: -17,
          ny: -27.5,
          nx: 1,
          cb: -0.5,
          fx: 3,
          fy: -38,
          bx: 1,
          by: -38,
          be: 0,
          ffx: 4,
          ffy: -4,
          fa: 0.3,
          bfx: -4,
          bfy: -3,
          ba: 0.4,
        }),
      ],
      [
        QUAKE.slam,
        g({ hx: 0.5, hy: -8, nx: 5, ny: -17, cb: 2, fx: 10, fy: -1, bx: 8, by: -1, be: 0, ffx: 6, bfx: -6, ba: 1 }),
        "snap",
      ],
      [
        frame(12),
        g({
          hx: 0.5,
          hy: -8.5,
          nx: 4.5,
          ny: -17.5,
          cb: 2,
          fx: 10,
          fy: -1.5,
          bx: 8,
          by: -1.5,
          be: 0,
          ffx: 6,
          bfx: -6,
          ba: 1,
        }),
      ],
      [frame(17), g({ hy: -11, nx: 3, ny: -21, fx: 8, fy: -14, bx: 6, by: -16 })],
      [ULT_LOCK, GUARD],
    ],
  },
} satisfies Record<string, ActionClip>;
