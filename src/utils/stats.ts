import { HERO_LEVEL_POWER } from "../constants/growth";
import type { BuildStats } from "../types/build";
import type { CharacterDef } from "../types/character";
import type { Perk, SkillNode, UltimateId } from "../types/skill";
import type { StatKey, Stats } from "../types/stats";

export const STAT_KEYS: readonly StatKey[] = ["ad", "ap", "hp", "mp", "stamina", "crit", "move", "aspd", "haste"];

export const allNodes = (c: CharacterDef): SkillNode[] => c.branches.flatMap((b) => b.nodes);

/** base plus growth plus flat node and shop bonuses, each total multiplied by the node percentages; attack damage and
 *  ability power then compound with the level, and the build's charms fold into HP, crit and move speed */
export function computeStats(
  c: CharacterDef,
  level: number,
  ranks: Readonly<Record<string, number>>,
  bonus: Partial<Stats> = {},
  build?: BuildStats,
): Stats {
  const flat = { ...c.base };
  const pct: Stats = { ad: 1, ap: 1, hp: 1, mp: 1, stamina: 1, crit: 1, move: 1, aspd: 1, haste: 1 };
  for (const k of STAT_KEYS) flat[k] += (c.growth[k] ?? 0) * (level - 1) + (bonus[k] ?? 0);
  for (const node of allNodes(c)) {
    const r = ranks[node.id] ?? 0;
    if (!r) continue;
    for (const k of STAT_KEYS) {
      flat[k] += (node.stats?.[k] ?? 0) * r;
      pct[k] += (node.scale?.[k] ?? 0) * r;
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

export function collectPerks(c: CharacterDef, ranks: Readonly<Record<string, number>>): Set<Perk> {
  const perks = new Set<Perk>();
  for (const node of allNodes(c)) if (node.perk && ranks[node.id]) perks.add(node.perk);
  return perks;
}

/** the strongest ultimate learned from a pick: any other before the character's special; none until one is learned */
export function learnedUltimate(c: CharacterDef, ranks: Readonly<Record<string, number>>): UltimateId | null {
  const learned = allNodes(c).filter((n) => n.ultimate && ranks[n.id]);
  return (learned.find((n) => n.ultimate !== c.special) ?? learned[0])?.ultimate ?? null;
}
