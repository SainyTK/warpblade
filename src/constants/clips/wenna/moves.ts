import type { ActionClip, Pose } from "../../../types/pose";
import { frame } from "../../hero";
import { BECKON, KINDLE, WENNA_SPELL } from "../../wenna/abilities";
import { GREAT_WICK } from "../../wenna/special";
import { LIGHT } from "../../wenna/wax";
import { CHARGE_POSE, HANG_LEGS, m, STANCE } from "./stance";

/** Light: the pole tipped back, then swung forward so the lantern throws its drop of flame ahead, and settled */
export const LIGHT_CLIP: ActionClip = {
  dur: LIGHT.dur,
  hit: LIGHT.release,
  keys: [
    [0, STANCE],
    [frame(2), m({ nx: 0.6, cb: -0.5, fx: 5, fy: -17.5, sa: -1.65, bx: 4.5, by: -13 })],
    [LIGHT.release, m({ nx: 1.8, cb: 0.5, fx: 8, fy: -18, sa: -0.85, bx: 6, by: -14, ffx: 4.5, bfx: -3 })],
    [frame(6), m({ nx: 1.6, cb: 0.3, fx: 7.5, fy: -17.8, sa: -0.98, bx: 5.8, by: -13.5, ffx: 4.5, bfx: -3 })],
    [LIGHT.dur, STANCE],
  ],
};

/** Kindle: the pole tipped back, then the lantern pointed down at the Wick as its flame swells, the far hand thrown open */
export const KINDLE_CLIP: ActionClip = {
  dur: KINDLE.dur,
  hit: KINDLE.swell,
  keys: [
    [0, STANCE],
    [frame(2), m({ nx: 0.4, cb: -0.5, fx: 5, fy: -18, sa: -1.7, bx: 3, by: -15, be: 0 })],
    [KINDLE.swell, m({ nx: 2.2, cb: 0.7, fx: 8, fy: -18, sa: -0.6, bx: 7, by: -18.5, be: 0, ffx: 5, bfx: -3 })],
    [frame(7), m({ nx: 2, cb: 0.6, fx: 7.6, fy: -17.8, sa: -0.66, bx: 7, by: -18, be: 0, ffx: 5, bfx: -3 })],
    [KINDLE.dur, STANCE],
  ],
};

/** Beckon: the pole raised and tipped out, the far hand reaching, then both drawn back to her as the Wicks come */
export const BECKON_CLIP: ActionClip = {
  dur: BECKON.dur,
  hit: frame(4),
  keys: [
    [0, STANCE],
    [frame(2), m({ nx: 1.5, cb: 0.3, fx: 6, fy: -21, sa: -1.2, bx: 9, by: -20, be: 0 })],
    [frame(4), m({ nx: -0.5, cb: -0.6, fx: 3.5, fy: -22.5, sa: -1.8, bx: 4, by: -21, be: 1, ffx: 3, bfx: -3 })],
    [frame(7), m({ nx: 0, cb: -0.5, fx: 4, fy: -21, sa: -1.7, bx: 4, by: -19, be: 1, ffx: 3, bfx: -3 })],
    [BECKON.dur, STANCE],
  ],
};

/** a spell: the lantern raised overhead, then thrust forward as the spell leaves it */
export const SPELL_CLIP: ActionClip = {
  dur: WENNA_SPELL.dur,
  hit: WENNA_SPELL.hit,
  keys: [
    [0, STANCE],
    [frame(3), m({ ny: -24.6, cb: -0.5, fx: 5, fy: -25, fe: 1, sa: -1.65, bx: 3, by: -22, be: 1 })],
    [frame(5), m({ ny: -24.8, cb: -0.7, fx: 4.5, fy: -26, fe: 1, sa: -1.75, bx: 2.5, by: -23, be: 1 })],
    [WENNA_SPELL.hit, m({ nx: 2, cb: 0.6, fx: 8, fy: -20, sa: -0.75, bx: 6, by: -19, be: 0, ffx: 5, bfx: -3 }), "snap"],
    [frame(9), m({ nx: 1.8, cb: 0.5, fx: 7.5, fy: -19.5, sa: -0.8, bx: 6, by: -18.5, ffx: 5, bfx: -3 })],
    [WENNA_SPELL.dur, STANCE],
  ],
};

/**
 * Great Wick: the pole lifted high in both hands, then planted at the end of the anticipation, its foot on the floor
 * ahead of her and both hands on it as she crouches over it while the giant rises
 */
export const GREAT_CLIP: ActionClip = {
  dur: GREAT_WICK.hold,
  hit: GREAT_WICK.windup,
  keys: [
    [0, CHARGE_POSE],
    [frame(4), { ...CHARGE_POSE, ny: -25, cb: -0.7, fy: -27, by: -23 }],
    [frame(7), { ...CHARGE_POSE, ny: -25.1, cb: -0.8, fy: -27.5, by: -23.5 }],
    [
      GREAT_WICK.windup,
      m({
        hy: -11.5,
        ny: -21.5,
        nx: 2.5,
        cb: 1,
        fx: 9,
        fy: -9,
        sa: -1.57,
        bx: 9,
        by: -14,
        be: 0,
        ffx: 6,
        bfx: -5,
        ba: 0.3,
      }),
      "snap",
    ],
    [
      GREAT_WICK.hold,
      m({
        hy: -11.8,
        ny: -21.8,
        nx: 2.3,
        cb: 0.9,
        fx: 9,
        fy: -9.2,
        sa: -1.57,
        bx: 9,
        by: -14.2,
        be: 0,
        ffx: 6,
        bfx: -5,
      }),
    ],
  ],
};

/** in the air the casts keep her legs together */
export const airborne = (p: Pose): Pose => ({ ...p, ...HANG_LEGS });
