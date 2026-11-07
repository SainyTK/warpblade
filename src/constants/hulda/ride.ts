import { frame } from "../hero";

/** Skyfall Breaker's ride on a big foe: the first pound lands this long after the catch, then one each `every` */
export const RIDE = {
  first: frame(6),
  every: frame(8),
  /** the pound's fist comes down this far into each beat */
  strike: frame(5),
  /** she leaps off backward this fast once the pounds are spent */
  leapVy: -230,
  leapVx: 70,
  /** where she kneels on its back, from the top of its body */
  sink: 3,
  stop: 0.06,
} as const;

/** a catch with Skyfall Breaker's bounce: she springs back up this fast to catch again */
export const SKY_BOUNCE = -240;

/** Comet Grab: K on the floor with nothing in reach leaps her up into a Skyfall, and its hands reach this box */
export const COMET = { rise: -300, ahead: 90, box: [0, -44, 24, 4] as const } as const;

/** Skyfall Breaker's dive drags foes it touches on the way down; its body box, from her feet */
export const DIVE_BOX = [-8, -28, 10, 2] as const;
