import type { HitFeel } from "../../../types/move";

/**
 * Seconds after each blow of Brynn's string before the next may cut in, so the weight of the blow shows. With the next
 * blow's long wind-up this sets her tempo: about 0.6 real seconds from one blow landing to the next and about 0.85 from
 * the slam to the next string's sweep.
 */
export const STRING_CANCEL = { sweep: 0.22, heave: 0.22, slam: 0.3 } as const;

/** hit-stop, shake and sound of each blow, heavy from the start and heaviest on the slam */
export const STRING_FEEL = {
  sweep: { stop: 0.08, shake: [0.14, 1.8], pitch: 0.9 },
  heave: { stop: 0.09, shake: [0.16, 2.1], pitch: 0.85 },
  slam: { stop: 0.17, shake: [0.32, 3.8], pitch: 0.6 },
  airSlam: { stop: 0.1, shake: [0.18, 2.4], pitch: 0.75 },
} as const satisfies Record<string, HitFeel>;

/** the power of each blow as a multiple of attack damage */
export const STRING_POWER = { sweep: 1.5, heave: 1.6, slam: 2.6, airSlam: 1.4 } as const;

/** Rising Heave throws foes up this fast, so the slam's tall arc catches them on the way down */
export const HEAVE_LAUNCH = -300;

/** the slam's shockwave along the floor ahead: how far it runs, how fast, its power, and how long it knocks foes down */
export const SHOCKWAVE = { reach: 70, speed: 280, power: 0.9, stun: 0.6 } as const;

/** the falling slam drops this fast once its tuck is over; its landing ring reaches this far each side at this power
 *  and knocks foes down this long, or throws them up this fast with Crater Leap */
export const AIR_SLAM = { dive: 480, reach: 40, ring: 1, stun: 0.6, launch: -220 } as const;

/** a heavy swing (Keen timing): its window after a blow lands, how much farther it reaches, and its crimson wave */
export const HEAVY = { window: 0.14, reach: 1.3, wave: 0.8, waveReach: 90 } as const;
