import type { ActionClip, Pose } from "../../../types/pose";
import { frame, pose } from "../../hero";

/**
 * Her stance: upright and still, feet close, the staff held upright at her side in the near hand with its ring above
 * her head, the far hand resting low on the shaft.
 */
export const STANCE: Pose = pose({
  hx: 0,
  hy: -14,
  nx: 0.5,
  ny: -24,
  cb: 0,
  fx: 6,
  fy: -16,
  fe: 0,
  bx: 4,
  by: -13,
  be: 1,
  ffx: 3,
  bfx: -2,
  sa: -1.45,
});

/** a pose that changes only some joints of her stance */
export const m = (p: Partial<Pose>): Pose => ({ ...STANCE, ...p });

/** the far hand closed on the shaft `d` pixels along it from the near hand (negative toward the butt), for a two-handed grip */
export const onShaft = (fx: number, fy: number, sa: number, d: number): { bx: number; by: number } => ({
  bx: fx + Math.cos(sa) * d,
  by: fy + Math.sin(sa) * d,
});

/** legs drawn together and pointed down as she hangs in the air */
export const HANG_LEGS = {
  ffx: 1.5,
  ffy: -1.5,
  fa: 0.6,
  bfx: -1,
  bfy: -2.5,
  ba: 0.7,
} as const;

/** her idle: the stance breathing, the ring swaying a little at the staff's top */
export const MIREL_IDLE: ActionClip = {
  dur: frame(40),
  hit: 0,
  keys: [
    [0, STANCE],
    [frame(10), m({ ny: -24.2, sa: -1.41, by: -13.2 })],
    [frame(20), m({ ny: -24.4, nx: 0.6, hy: -14.1, sa: -1.38, fy: -16.2, by: -13.4 })],
    [frame(30), m({ ny: -24.2, sa: -1.42, by: -13.2 })],
    [frame(40), STANCE],
  ],
};

/** the ultimate gathering: the staff raised overhead in both hands, the ring glowing */
export const CHARGE_POSE: Pose = m({
  hy: -13.5,
  ny: -24.5,
  nx: 0,
  cb: -0.5,
  fx: 4,
  fy: -29,
  fe: 1,
  bx: 2,
  by: -27,
  be: 1,
  ffx: 4,
  bfx: -3,
  sa: -1.55,
});

/** the hover: upright, legs together and pointed, the staff held level across her chest in both hands */
export const HOVER_POSE: Pose = m({
  hy: -14.5,
  ny: -24.5,
  nx: 0.5,
  fx: 7,
  fy: -18,
  sa: -0.15,
  bx: 3,
  by: -18,
  be: 0,
  ...HANG_LEGS,
});
