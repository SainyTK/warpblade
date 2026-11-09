import type { ActionClip, Pose } from "../../../types/pose";
import { frame, pose } from "../../hero";

/**
 * Her stance: a little hunched under her hood, feet close, the lamp pole held upright at her side in the near hand and
 * tipped a touch forward so the lantern hangs ahead of her hood, the far hand resting on the shaft below.
 */
export const STANCE: Pose = pose({
  hx: 0,
  hy: -14,
  nx: 1,
  ny: -24,
  cb: -0.3,
  fx: 6,
  fy: -17,
  fe: 0,
  bx: 5,
  by: -12.5,
  be: 1,
  ffx: 3,
  bfx: -2.5,
  sa: -1.35,
});

/** a pose that changes only some joints of her stance */
export const m = (p: Partial<Pose>): Pose => ({ ...STANCE, ...p });

/** legs drawn together and pointed down as she hangs in the air */
export const HANG_LEGS = { ffx: 1.5, ffy: -1.5, fa: 0.6, bfx: -1, bfy: -2.5, ba: 0.7 } as const;

/**
 * Her idle: the stance breathing under the cloak, the shoulders rising and settling, and the pole's top rocking a
 * little forward and back so the lantern sways on its chain.
 */
export const WENNA_IDLE: ActionClip = {
  dur: frame(48),
  hit: 0,
  keys: [
    [0, STANCE],
    [frame(12), m({ ny: -24.25, nx: 1.1, sa: -1.31, fx: 6.2, by: -12.6 })],
    [frame(24), m({ ny: -24.45, nx: 1.15, hy: -14.1, cb: -0.2, sa: -1.33, fx: 6.3, fy: -17.2, by: -12.8 })],
    [frame(36), m({ ny: -24.2, nx: 1, sa: -1.39, fx: 5.9, by: -12.6 })],
    [frame(48), STANCE],
  ],
};

/** the special gathering: the pole raised before her in both hands, the lantern high and roaring */
export const CHARGE_POSE: Pose = m({
  hy: -13.5,
  ny: -24.4,
  nx: 0.5,
  cb: -0.4,
  fx: 5,
  fy: -24,
  fe: 1,
  bx: 4.5,
  by: -19,
  be: 1,
  ffx: 4,
  bfx: -3,
  sa: -1.55,
});
