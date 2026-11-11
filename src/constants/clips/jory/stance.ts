import type { ActionClip, Pose } from "../../../types/pose";
import { frame, pose } from "../../hero";

/**
 * His ready stance: broad and planted, feet wide, the near mallet riding at his shoulder with its head forward, the far
 * fist low in front of the drum at his hip.
 */
export const STANCE: Pose = pose({
  hx: -0.5,
  hy: -13.5,
  nx: 1.2,
  ny: -23.6,
  cb: 0.5,
  fx: 5,
  fy: -17.5,
  sa: -0.9,
  bx: 2.5,
  by: -15.5,
  be: 1,
  ffx: 4.5,
  bfx: -4.5,
});

/** a pose that changes only some joints of his stance */
export const s = (p: Partial<Pose>): Pose => ({ ...STANCE, ...p });

/** the beat ride, down: the near mallet just tapped, low at the chest with its head forward */
export const RIDE_DOWN: Pose = s({ fx: 6.5, fy: -16, sa: -0.35 });

/** the beat ride, up: the near mallet raised over the shoulder, peaking just before the beat */
export const RIDE_UP: Pose = s({ fx: 7, fy: -20, sa: -1.3, ny: -23.8 });

/** the nod on the beat: the head and shoulders drop a little and come back */
export const NOD: Partial<Pose> = { ny: 0.8, nx: 0.3, hy: 0.3, fy: 0.4, by: 0.4 };

/**
 * His idle as one beat at his slowest tempo, for his portrait at rest: the mallet up just before the beat, tapping down
 * on it and rising again. In a run his idle rides the real beat instead.
 */
export const JORY_IDLE: ActionClip = {
  dur: frame(19),
  hit: 0,
  keys: [
    [0, RIDE_UP],
    [frame(1), RIDE_DOWN, "snap"],
    [frame(3), s({ fx: 6.4, fy: -16.4, sa: -0.45, ny: -23.2 })],
    [frame(11), s({ fx: 6, fy: -17, sa: -0.7 })],
    [frame(15), s({ fx: 5, fy: -19.2, sa: -1.4 })],
    [frame(19), RIDE_UP],
  ],
};

/** the special gathering: the drum swung to his front and planted, both mallets raised high over it */
export const CHARGE_POSE: Pose = s({
  hy: -12,
  ny: -22.4,
  nx: 1.6,
  cb: 0.9,
  fx: 4,
  fy: -24,
  sa: -1.6,
  bx: 2.5,
  by: -23.5,
  be: 0,
  ffx: 5.5,
  bfx: -5.5,
  dr: 1,
});
