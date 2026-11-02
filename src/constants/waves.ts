export const STAGE_WAVES = 30;
export const MINI_BOSS_EVERY = 5;
export const BOSS_WAVES: readonly number[] = [20, 30];
/** seconds from a clear stage to the skill tree, and from the skill tree to the next wave */
export const WAVE_PAUSE = { toSkills: 1.1, toNext: 1.2 } as const;
/** per wave after the first: foe HP, foe damage and experience grow by these fractions */
export const WAVE_SCALE = { hp: 0.09, damage: 0.05, xp: 0.04 } as const;
/** per wave after the first, foes wait less between attacks and wind up faster, down to these floors */
export const AGGRESSION = { cooldown: 0.015, cooldownFloor: 0.6, windup: 0.01, windupFloor: 0.7 } as const;
export const MAX_FOES = 9;
