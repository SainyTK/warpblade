/**
 * experience orbs: about `share` experience each at wave 1, more each wave as foes give more, so a kill drops as many
 * orbs late as early, at most `most`; with `crowd` orbs lying about, kills drop fewer and past it they add to the nearest
 */
export const XP_ORB = { share: 6, most: 12, crowd: 60 } as const;
/** how experience orbs move: they pop out, fall and bounce, then fly to Kael if he has not walked over them */
export const XP_ORB_MOTION = {
  gravity: 480,
  bounce: 0.4,
  /** seconds before an orb can be picked up by touch */
  settle: 0.3,
  /** seconds before an orb left on the floor flies to Kael, so none is lost */
  pull: 4,
  /** how close to Kael's chest an orb is picked up, in art pixels */
  reach: 14,
  pullAccel: 900,
  pullSpeed: 220,
} as const;
/** the longest combo by level: two hits at the start, six at most */
export const COMBO_BY_LEVEL: readonly (readonly [level: number, hits: number])[] = [
  [1, 2],
  [11, 3],
  [21, 4],
  [38, 5],
  [65, 6],
];
export const MAX_COMBO = 6;
/** part of max HP and MP restored on a level up: a little, since a full run gains about 80 levels */
export const LEVEL_UP_RESTORE = 0.05;
