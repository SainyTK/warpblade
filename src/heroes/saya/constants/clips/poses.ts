import { pose } from "../../../../constants/hero";
import type { Pose } from "../../../../types/pose";
import { BLADE_STATE } from "../blade";

const { drawn, sheathed, held } = BLADE_STATE;

/**
 * Saya's key poses, shared by her clips so each one starts and ends where the next picks up. Facing right, in pixels
 * from the feet. Her blade is sheathed at rest and drawn only between a draw and a sheathe.
 */
export const SAYA_POSES = {
  /** at rest: weight on the back leg, the far hand on the scabbard's mouth with the thumb on the guard, the sword hand
   *  loose at her side */
  rest: pose({
    hx: -0.5,
    hy: -14,
    cb: 0.2,
    nx: 0.4,
    ny: -24,
    fx: 3.6,
    fy: -13.2,
    bx: 3.4,
    by: -14.6,
    ffx: 3.6,
    bfx: -3.2,
    ba: 0.15,
    sa: 1.3,
    bs: sheathed,
  }),
  /** the coil before a draw: sunk low and leaning in, the sword hand on the hilt and the far hand on the mouth */
  coil: pose({
    hx: -1.5,
    hy: -11.4,
    cb: 1.4,
    nx: 2.4,
    ny: -21.2,
    fx: 6.4,
    fy: -15.6,
    bx: 4.6,
    by: -14.4,
    ffx: 7,
    bfx: -6,
    ba: 0.35,
    sa: -2.6,
    bs: sheathed,
  }),
  /** between blows: the blade drawn and held low ahead, the far hand back on the empty scabbard */
  ready: pose({
    hx: 1.5,
    hy: -12.8,
    cb: 0.4,
    nx: 2.8,
    ny: -22.8,
    fx: 9,
    fy: -16.5,
    sa: 0.32,
    bx: 3,
    by: -14.8,
    ffx: 7.5,
    bfx: -5,
    ba: 0.2,
    bs: drawn,
  }),
  /** the blade brought across to the scabbard's mouth, point first, ready to slide home */
  mouth: pose({
    hx: 0,
    hy: -13.4,
    cb: 0.2,
    nx: 1.4,
    ny: -23.4,
    fx: 9.5,
    fy: -20.5,
    sa: 2.72,
    bx: 4.2,
    by: -15,
    ffx: 5,
    bfx: -4,
    bs: drawn,
  }),
  /** the click: the blade home, the sword hand on the hilt, upright and still */
  click: pose({
    hx: -0.3,
    hy: -13.6,
    cb: -0.3,
    nx: 0.4,
    ny: -23.6,
    fx: 6.6,
    fy: -16.4,
    bx: 3.8,
    by: -14.8,
    ffx: 4.4,
    bfx: -3.4,
    sa: -2.6,
    bs: sheathed,
  }),
  /** the guard: the sheathed katana held across her body in both hands, the hilt before her chest and the scabbard
   *  rising back over her shoulder, so a blow from the front meets the lacquer */
  guard: pose({
    hx: -1,
    hy: -12.6,
    cb: 0.6,
    nx: 1.2,
    ny: -22.6,
    fx: 7.4,
    fy: -19.4,
    bx: 1.6,
    by: -22,
    sa: -2.55,
    ffx: 6,
    bfx: -5.5,
    ba: 0.3,
    bs: held,
  }),
} as const satisfies Record<string, Pose>;
