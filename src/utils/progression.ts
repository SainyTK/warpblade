import { AIR_STRING } from "../constants/combo";
import { MAX_LEVEL, XP_CURVE } from "../constants/growth";
import { STRING } from "../constants/hulda/fists";
import { COMBO_BY_LEVEL, MAX_COMBO } from "../constants/progression";
import { AGGRESSION, STAGE_WAVES, WAVE_SCALE } from "../constants/waves";
import { GLAIVE_STRING_BONUS } from "../constants/ysra/glaive";
import type { KitId } from "../types/kit";
import type { Perk } from "../types/skill";

/** air attacks Kael may make before he lands, from his ranks of the air string skill */
export const airLimit = (ranks: Readonly<Record<string, number>>): number =>
  AIR_STRING.hits + (ranks[AIR_STRING.skill] ?? 0);

/** experience needed to go from this level to the next; 0 at the cap */
export const xpToNext = (level: number): number =>
  level >= MAX_LEVEL ? 0 : XP_CURVE.base + XP_CURVE.step * (level - 1);

/** experience from level 1 up to the start of a level */
export function xpToReach(level: number): number {
  let total = 0;
  for (let l = 1; l < Math.min(level, MAX_LEVEL); l++) total += xpToNext(l);
  return total;
}

/** the longest combo at a level, one longer with Flowing Chain */
export function comboLimit(level: number, flowing: boolean): number {
  let hits = 0;
  for (const [from, n] of COMBO_BY_LEVEL) if (level >= from) hits = n;
  return Math.min(MAX_COMBO, hits + (flowing ? 1 : 0));
}

/** the longest string of the hero being played: Kael's combo, Ysra's glaive string, one blow longer at every level, or
 *  Hulda's fist string, one blow longer with Uppercut */
export function stringLimit(kit: KitId, level: number, perks: ReadonlySet<Perk>): number {
  if (kit === "ysra") return comboLimit(level, perks.has("longString")) + GLAIVE_STRING_BONUS;
  if (kit === "hulda") return STRING.length + (perks.has("uppercut") ? 1 : 0);
  return comboLimit(level, perks.has("flowingChain"));
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
