import { MAX_LEVEL, XP_CURVE } from "../constants/growth";
import { AGGRESSION, STAGE_WAVES, WAVE_SCALE } from "../constants/waves";

/** experience needed to go from this level to the next; 0 at the cap */
export const xpToNext = (level: number): number =>
  level >= MAX_LEVEL ? 0 : XP_CURVE.base + XP_CURVE.step * (level - 1);

/** experience from level 1 up to the start of a level */
export function xpToReach(level: number): number {
  let total = 0;
  for (let l = 1; l < Math.min(level, MAX_LEVEL); l++) total += xpToNext(l);
  return total;
}

/**
 * how much a wave scales foe HP and experience (compounding), foe damage (linear), and how much shorter foes' pauses and
 * wind-ups get
 */
export function waveScale(wave: number): { hp: number; damage: number; xp: number; cooldown: number; windup: number } {
  const n = Math.max(0, Math.min(STAGE_WAVES, wave) - 1);
  return {
    hp: WAVE_SCALE.hp ** n,
    damage: 1 + WAVE_SCALE.damage * n,
    xp: WAVE_SCALE.xp ** n,
    cooldown: Math.max(AGGRESSION.cooldownFloor, 1 - AGGRESSION.cooldown * n),
    windup: Math.max(AGGRESSION.windupFloor, 1 - AGGRESSION.windup * n),
  };
}
