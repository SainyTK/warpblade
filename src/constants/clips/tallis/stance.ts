import type { ActionClip, Pose } from "../../../types/pose";
import { frame, pose } from "../../hero";

/** the angle his knives sit at in reverse grip: blades down from the little finger side of each fist */
export const REVERSE = 1.85;

/**
 * His ready stance: low on bent knees with the weight forward, the near knife held at the ribs blade down, the far fist
 * up by the chin with its knife along the forearm.
 */
export const STANCE: Pose = pose({
  hx: -0.5,
  hy: -12.5,
  nx: 2,
  ny: -22,
  cb: 0.6,
  fx: 6,
  fy: -16.5,
  fe: 0,
  bx: 4.5,
  by: -19.5,
  be: 1,
  ffx: 4.5,
  bfx: -4.5,
  ba: 0.15,
  sa: REVERSE,
});

/** a pose that changes only some joints of his stance */
export const s = (p: Partial<Pose>): Pose => ({ ...STANCE, ...p });

/** legs tucked under him in the air */
export const TUCK = { ffx: 3, ffy: -5, fa: 0.4, bfx: -2.5, bfy: -3.5, ba: 0.5 } as const;

/**
 * His idle: the stance breathing under a pixel a frame, the cloak lifting with it, and the near knife turning in his
 * fingers, the blade rolling forward and back over the beat.
 */
export const TALLIS_IDLE: ActionClip = {
  dur: frame(40),
  hit: 0,
  keys: [
    [0, STANCE],
    [frame(10), s({ ny: -22.3, nx: 2.1, fy: -16.7, by: -19.7, sa: REVERSE - 0.35 })],
    [frame(20), s({ ny: -22.5, nx: 2.2, hy: -12.6, fy: -16.9, by: -19.9, sa: REVERSE - 0.6 })],
    [frame(30), s({ ny: -22.3, nx: 2.1, fy: -16.7, by: -19.7, sa: REVERSE - 0.25 })],
    [frame(40), STANCE],
  ],
};

/** the special gathering: crouched deep, both knives crossed before his chest */
export const CHARGE_POSE: Pose = s({
  hx: -1,
  hy: -10,
  nx: 1.5,
  ny: -19.5,
  cb: 1,
  fx: 5,
  fy: -15,
  fe: 1,
  bx: 6,
  by: -16,
  be: 0,
  ffx: 5.5,
  bfx: -5.5,
  ba: 0.25,
  sa: 2.5,
});

/** the hood coming down or lifting as the Veil rises or ends: a dip of the knees and the shoulders */
export const VEIL_DIP: Partial<Pose> = { hy: 1.5, ny: 1.6, fy: 1, by: 1 };
