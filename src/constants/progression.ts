export const MAX_LEVEL = 30;
/** experience for the next level: base + step x (level - 1) */
export const XP_CURVE = { base: 24, step: 13 } as const;
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
export const SKILL_POINTS = { start: 1, perLevel: 1 } as const;
