import type { ActionClip, Pose } from "../../../types/pose";
import { frame, pose } from "../../hero";

/** her guard: a wide, low stance, both fists up before the chin, the lead fist a little ahead */
export const GUARD: Pose = pose({
  hx: -0.5,
  hy: -12.5,
  nx: 1.5,
  ny: -22.5,
  cb: 0.5,
  fx: 7,
  fy: -19,
  bx: 5,
  by: -20,
  be: 1,
  ffx: 5,
  bfx: -5,
  ba: 0.1,
  sa: 0,
});

/** a pose that changes only some joints of her guard */
export const g = (o: Partial<Pose>): Pose => ({ ...GUARD, ...o });

/** the legs tucked under her in the air */
export const AIR_LEGS = { ffx: 4, ffy: -5, fa: 0.3, bfx: -3, bfy: -3, ba: 0.4 } as const;

/** her idle: the guard with the shoulders rising and falling under a pixel a frame */
export const HULDA_IDLE: ActionClip = {
  dur: frame(40),
  hit: 0,
  keys: [
    [0, GUARD],
    [frame(10), g({ ny: -22.8, nx: 1.6, fy: -19.3, by: -20.3 })],
    [frame(20), g({ ny: -23, nx: 1.7, fy: -19.5, by: -20.5, hy: -12.6 })],
    [frame(30), g({ ny: -22.8, nx: 1.6, fy: -19.3, by: -20.3 })],
    [frame(40), GUARD],
  ],
};

/** a foe held at her hands: both arms out low, the shoulders set and the knees bent under the weight */
export const HOLD_POSE: Pose = g({ hx: -1, hy: -12, nx: 0.5, ny: -22, cb: 0.5, fx: 9, fy: -17, bx: 8, by: -18, be: 0 });

/** the ultimate gathering: knees deep, both fists clenched low at her sides */
export const CHARGE_POSE: Pose = g({
  hy: -11,
  nx: 1,
  ny: -21,
  cb: 1,
  fx: 5,
  fy: -12,
  bx: -3,
  by: -12,
  be: 0,
  ffx: 6,
  bfx: -6,
});
