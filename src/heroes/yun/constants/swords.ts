/**
 * Spirit swords: translucent jade copies of the jian that hover behind Yun. He holds at most `most`; a run starts with
 * `start`; while he holds fewer than `rest` one comes back every `regen` seconds; Returning Tide landing and a parry
 * each give `gain`. Sage's Breath raises the most he can hold up to `cap`.
 */
export const SPIRIT = { most: 4, start: 2, rest: 2, regen: 2.5, gain: 1, cap: 8 } as const;

/**
 * Sword Echo: after each blow of his strings every held sword thrusts ahead, one after another `gap` seconds apart,
 * from `near` to `far` pixels in front of him and `top` to `low` from his feet, for `power` times attack damage. A
 * thrust flies out in `out` seconds, holds `hold` and comes back in `back`. A Keen blow's echo reaches `keenReach` times
 * as far and is a sure critical hit.
 */
export const ECHO = {
  gap: 0.035,
  near: 22,
  far: 64,
  top: -34,
  low: -6,
  power: 0.22,
  out: 0.07,
  hold: 0.05,
  back: 0.12,
  keenReach: 1.33,
  push: 30,
} as const;

/** where the swords hover behind him, from his feet facing right: the fan's first place, the step to the next, the bob
 *  of their float, and a second fan further back for swords past the first `perFan` */
export const HOVER = {
  x: -9,
  y: -33,
  stepX: -2.5,
  stepY: 4.5,
  tilt: -1.2,
  tiltStep: 0.32,
  bob: 1,
  rate: 2.2,
  perFan: 4,
  backX: -5,
  backY: -3,
} as const;
/** where the swords fan out before him as a screen while he guards */
export const SCREEN = { x: 11, y: -30, stepY: 6, tilt: -1.57, spread: 0.18 } as const;
/** a spirit sword's length from pommel to point, in pixels */
export const SPIRIT_LENGTH = 14;
