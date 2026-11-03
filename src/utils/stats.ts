import type { CharacterDef } from "../types/character";
import type { Perk, SkillNode, UltimateId } from "../types/skill";
import type { StatKey, Stats } from "../types/stats";

export const STAT_KEYS: readonly StatKey[] = ["ad", "ap", "hp", "mp", "stamina", "crit", "move", "aspd", "haste"];

export const allNodes = (c: CharacterDef): SkillNode[] => c.branches.flatMap((b) => b.nodes);

/** base plus growth plus flat node and shop bonuses, then each total multiplied by the node percentages */
export function computeStats(
  c: CharacterDef,
  level: number,
  ranks: Readonly<Record<string, number>>,
  bonus: Partial<Stats> = {},
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
  return out;
}

export function collectPerks(c: CharacterDef, ranks: Readonly<Record<string, number>>): Set<Perk> {
  const perks = new Set<Perk>();
  for (const node of allNodes(c)) if (node.perk && ranks[node.id]) perks.add(node.perk);
  return perks;
}

/** the ultimate learned from a level-up pick, otherwise the character's special */
export function learnedUltimate(c: CharacterDef, ranks: Readonly<Record<string, number>>): UltimateId {
  return allNodes(c).find((n) => n.ultimate && ranks[n.id])?.ultimate ?? c.special;
}
