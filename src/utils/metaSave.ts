import type { ArmoryItem, MetaSave } from "../types/armory";
import { priceOfAll } from "./armory";
import { count, isRecord } from "./saveFields";
import { emptyTracked, parseTracked } from "./trackedStats";

const emptyMeta = (): MetaSave => ({
  coins: 0,
  owned: {},
  spentOnOwned: 0,
  switchedOff: [],
  achievements: [],
  tracked: emptyTracked(),
  unlocks: [],
  recipes: [],
});

const knownIds = (raw: unknown, known: readonly string[]): string[] =>
  Array.isArray(raw) ? [...new Set(known)].filter((id) => raw.includes(id)) : [];

export interface KnownIds {
  achievements: readonly string[];
  unlocks: readonly string[];
  recipes: readonly string[];
  heroUnlockId: (hero: string) => string;
}

function ownedLevels(raw: unknown, items: readonly ArmoryItem[]): Record<string, number> {
  const saved = isRecord(raw) ? raw : {};
  const owned: Record<string, number> = {};
  for (const item of items) {
    const level = Math.min(item.levels, count(saved[item.id]));
    if (level) owned[item.id] = level;
  }
  return owned;
}

function unlockIds(raw: Record<string, unknown>, known: KnownIds): string[] {
  const heroesBought = Array.isArray(raw.heroes) ? raw.heroes.map((hero) => known.heroUnlockId(String(hero))) : [];
  const saved = Array.isArray(raw.unlocks) ? [...raw.unlocks, ...heroesBought] : heroesBought;
  return knownIds(saved, known.unlocks);
}

export function parseMeta(raw: unknown, items: readonly ArmoryItem[], known: KnownIds): MetaSave {
  if (!isRecord(raw)) return emptyMeta();
  const owned = ownedLevels(raw.owned, items);
  const spentOnOwned = "spentOnOwned" in raw ? count(raw.spentOnOwned) : priceOfAll(items, owned);
  return {
    coins: count(raw.coins),
    owned,
    spentOnOwned,
    switchedOff: knownIds(raw.switchedOff, Object.keys(owned)),
    achievements: knownIds(raw.achievements, known.achievements),
    tracked: parseTracked(raw.tracked),
    unlocks: unlockIds(raw, known),
    recipes: knownIds(raw.recipes, known.recipes),
  };
}
