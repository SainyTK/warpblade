export const MAX_LEVEL = 30;
/** experience for the next level: base + step x (level - 1); twice the first curve, so a full run ends near level 18 instead of 26 */
export const XP_CURVE = { base: 48, step: 26 } as const;
/** a slain foe's experience drops as orbs of about this much each, at most this many */
export const XP_ORB = { share: 6, most: 12 } as const;
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
  [5, 3],
  [9, 4],
  [13, 5],
  [17, 6],
];
export const MAX_COMBO = 6;
/** part of max HP and MP restored on a level up */
export const LEVEL_UP_RESTORE = 0.3;
/** skills offered on each level up */
export const PICK_COUNT = 3;
