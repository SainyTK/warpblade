import { COMBO_BY_LEVEL, MAX_COMBO, MAX_LEVEL, XP_CURVE } from "../constants/progression";
import { AGGRESSION, STAGE_WAVES, WAVE_SCALE } from "../constants/waves";

/** experience needed to go from this level to the next; 0 at the cap */
export const xpToNext = (level: number): number =>
  level >= MAX_LEVEL ? 0 : XP_CURVE.base + XP_CURVE.step * (level - 1);

/** the longest combo at a level, one longer with Flowing Chain */
export function comboLimit(level: number, flowing: boolean): number {
  let hits = 0;
  for (const [from, n] of COMBO_BY_LEVEL) if (level >= from) hits = n;
  return Math.min(MAX_COMBO, hits + (flowing ? 1 : 0));
}

/** how much a wave scales foe HP, foe damage, experience, and how much shorter foes' pauses and wind-ups get */
export function waveScale(wave: number): { hp: number; damage: number; xp: number; cooldown: number; windup: number } {
  const n = Math.max(0, Math.min(STAGE_WAVES, wave) - 1);
  return {
    hp: 1 + WAVE_SCALE.hp * n,
    damage: 1 + WAVE_SCALE.damage * n,
    xp: 1 + WAVE_SCALE.xp * n,
    cooldown: Math.max(AGGRESSION.cooldownFloor, 1 - AGGRESSION.cooldown * n),
    windup: Math.max(AGGRESSION.windupFloor, 1 - AGGRESSION.windup * n),
  };
}
