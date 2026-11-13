import { frame } from "../hero";

/** Quake Drop, her special: the fists fall on this frame of the ultimate's clip, and minions are thrown up this fast */
export const QUAKE = { slam: frame(7), launch: -260, bigStun: 0.6, shake: [0.35, 4] as const } as const;

/**
 * What the Quake Drop skill adds: the tethers drag foes to this far in front of her before the fists fall; the
 * aftershock's crack follows the first this long after; fliers over the crack are shaken down this far and reel; a
 * landed blow in iron cracks the floor this far each way, at most once each `quakeGap`.
 */
export const QUAKE_SKILL = {
  tetherTime: frame(6),
  tetherTo: 14,
  aftershock: 0.4,
  flierDrop: 40,
  flierStun: 0.8,
  blowReach: 40,
  quakeGap: 0.2,
} as const;
