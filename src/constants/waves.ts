export const STAGE_WAVES = 30;
export const MINI_BOSS_EVERY = 5;
export const BOSS_WAVES: readonly number[] = [20, 30];
/** seconds from a cleared wave to the rifts of the next one */
export const WAVE_PAUSE = 2;

/** foes a wave brings in all: base x growth^(wave - 1), rounded; 4 at wave 1, 63 at wave 30 */
export const WAVE_QUOTA = { base: 4, growth: 1.1 } as const;
/** a boss wave streams this share of its quota besides the Warden */
export const BOSS_STREAM_SHARE = 0.5;
/** foes standing at once: base + ceil(perWave x wave), at most `most`; a co-op room's longer stream raises it to `coopMost` */
export const ALIVE_CAP = { base: 3, perWave: 0.6, most: 22, coopMost: 30 } as const;
/** seconds from a freed place to the rift that fills it */
export const REFILL_DELAY = 0.35;
/** seconds between the rifts that open together at a wave's start */
export const OPENING_STAGGER = 0.25;

/** walkers come from wave 2, a third more of the stream each wave, up to half of it */
export const WALKER_SHARE = { perWave: 1 / 3, most: 0.5 } as const;

/** foe HP and experience multiply by these each wave after the first; damage grows by its fraction, not compounding */
export const WAVE_SCALE = { hp: 1.125, xp: 1.07, damage: 0.05 } as const;
/** HP on top of the wave's scale, by rank */
export const RANK_HP = { minion: 1, mini: 3, boss: 6 } as const;
/** per wave after the first, foes wait less between attacks and wind up faster, down to these floors */
export const AGGRESSION = { cooldown: 0.015, cooldownFloor: 0.6, windup: 0.01, windupFloor: 0.7 } as const;

/**
 * From wave `from`, each normal wave whose number divides by `every` brings one elite among its quota, as its
 * `at` share of the stream comes through: a normal foe with these multiples of HP, experience and coins, and a chest.
 */
export const ELITE = { from: 3, every: 3, at: 0.5, hp: 5, xp: 3, coins: 2 } as const;

/** where rifts open: this far from any hero, spread from the foes and rifts already there */
export const SPAWN = { margin: 24, heroGap: 64, tries: 8 } as const;
