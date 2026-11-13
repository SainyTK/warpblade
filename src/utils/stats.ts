import { HERO_LEVEL_POWER } from "../constants/growth";
import type { BuildStats } from "../types/build";
import type { CharacterDef } from "../types/character";
import type { SkillLevel } from "../types/skill";
import type { StatKey, Stats } from "../types/stats";

export const STAT_KEYS: readonly StatKey[] = ["ad", "ap", "hp", "mp", "stamina", "crit", "move", "aspd", "haste"];

/** base plus growth plus flat skill and shop bonuses, each total multiplied by the skill percentages; attack damage and
 *  ability power then compound with the level, and the build's charms fold into HP, crit and move speed */
export function computeStats(
  c: CharacterDef,
  level: number,
  rows: readonly SkillLevel[] = [],
  bonus: Partial<Stats> = {},
  build?: BuildStats,
): Stats {
  const flat = { ...c.base };
  const pct: Stats = { ad: 1, ap: 1, hp: 1, mp: 1, stamina: 1, crit: 1, move: 1, aspd: 1, haste: 1 };
  for (const k of STAT_KEYS) flat[k] += (c.growth[k] ?? 0) * (level - 1) + (bonus[k] ?? 0);
  for (const row of rows) {
    for (const k of STAT_KEYS) {
      flat[k] += row.stats?.[k] ?? 0;
      pct[k] += row.scale?.[k] ?? 0;
    }
  }
  const out = { ...flat };
  for (const k of STAT_KEYS) out[k] = flat[k] * pct[k];
  const power = HERO_LEVEL_POWER ** (level - 1);
  out.ad *= power;
  out.ap *= power;
  if (!build) return out;
  out.hp *= build.vigor;
  out.crit += build.crit;
  out.move *= build.move;
  return out;
}
