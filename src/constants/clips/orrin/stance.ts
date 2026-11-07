import type { ActionClip, Pose } from "../../../types/pose";
import { frame, pose } from "../../hero";

/**
 * His stance: light on the feet, weight forward, the chain hand loose and low ahead with a little chain hanging from
 * it, the coiled forearm held up across the body.
 */
export const STANCE: Pose = pose({
  hx: 0,
  hy: -13.5,
  nx: 1.5,
  ny: -23.5,
  cb: 0.5,
  fx: 7,
  fy: -14,
  bx: 3,
  by: -18,
  be: 1,
  ffx: 4,
  bfx: -4,
  ba: 0.1,
  sa: 1.2,
});

/** a pose that changes only some joints of his stance */
export const o = (p: Partial<Pose>): Pose => ({ ...STANCE, ...p });

/** legs drawn up under him in the air */
export const TUCK = { ffx: 4, ffy: -6, fa: 0.4, bfx: -2, bfy: -4, ba: 0.5 } as const;

/** his idle: the stance breathing, the chain hand swaying a little as the loop swings */
export const ORRIN_IDLE: ActionClip = {
  dur: frame(36),
  hit: 0,
  keys: [
    [0, STANCE],
    [frame(9), o({ ny: -23.8, fx: 7.3, fy: -14.2, by: -18.3 })],
    [frame(18), o({ ny: -24, nx: 1.6, fx: 7.5, fy: -14.5, by: -18.5, hy: -13.6 })],
    [frame(27), o({ ny: -23.8, fx: 7.2, fy: -14.2, by: -18.3 })],
    [frame(36), STANCE],
  ],
};

/** the ultimate gathering: crouched with the chain hand up and back, ready to swing it overhead */
export const CHARGE_POSE: Pose = o({
  hy: -11,
  ny: -21,
  nx: 1,
  cb: 1,
  fx: -2,
  fy: -32,
  fe: 1,
  bx: 5,
  by: -16,
  ffx: 6,
  bfx: -6,
  sa: -1.4,
});

/** hanging under the chain: the chain hand straight up over his head, the free arm reaching forward */
export const HANG: Pose = o({
  hx: 0,
  hy: -14,
  nx: 0.5,
  ny: -24,
  cb: 0,
  fx: 1,
  fy: -34,
  fe: 0,
  bx: 7,
  by: -21,
  be: 0,
  ffx: 2,
  ffy: -2,
  fa: 0.5,
  bfx: -2,
  bfy: -1,
  ba: 0.4,
  sa: -1.6,
});
