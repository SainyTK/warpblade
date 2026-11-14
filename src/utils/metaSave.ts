import type { MetaSave, ShopItem } from "../types/shop";
import { maxLevel } from "./shop";
import { emptyTracked, parseTracked } from "./trackedStats";

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const count = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) && v > 0 ? Math.floor(v) : 0);

const emptyMeta = (): MetaSave => ({
  coins: 0,
  owned: {},
  heroes: [],
  refund: 0,
  achievements: [],
  tracked: emptyTracked(),
  unlocks: [],
  recipes: [],
});

/** the known ids from a saved list, once each; a save from before the list existed has none */
const knownIds = (raw: unknown, known: readonly string[]): string[] =>
  Array.isArray(raw) ? [...new Set(known)].filter((id) => raw.includes(id)) : [];

/** the coins a save gets back for the heroes it bought that have left the roster, by the price each cost */
const refundFor = (raw: unknown, removed: Readonly<Record<string, number>>): number =>
  Array.isArray(raw)
    ? Object.entries(removed).reduce((sum, [id, price]) => sum + (raw.includes(id) ? price : 0), 0)
    : 0;

/** the ids parseMeta keeps from a save: heroes that can be bought, and the achievements, unlocks and skills the game has */
export interface KnownIds {
  heroes: readonly string[];
  /** heroes that left the roster, with the price each cost: a save that bought one gets it back */
  removedHeroes: Readonly<Record<string, number>>;
  achievements: readonly string[];
  unlocks: readonly string[];
  skills: readonly string[];
}

/**
 * read saved meta progress, keeping only known items within their levels, known heroes, achievements, unlocks and recipes;
 * fields a save from an older version lacks start empty, and anything unreadable starts fresh. A hero bought and since
 * removed is dropped from the list and its price goes back into the bank, once, since the saved list no longer has it.
 */
export function parseMeta(raw: unknown, items: readonly ShopItem[], known: KnownIds): MetaSave {
  if (!isRecord(raw)) return emptyMeta();
  const saved = isRecord(raw.owned) ? raw.owned : {};
  const owned: Record<string, number> = {};
  for (const item of items) {
    const level = Math.min(maxLevel(item), count(saved[item.id]));
    if (level) owned[item.id] = level;
  }
  const refund = refundFor(raw.heroes, known.removedHeroes);
  return {
    coins: count(raw.coins) + refund,
    owned,
    heroes: knownIds(raw.heroes, known.heroes),
    refund: count(raw.refund) + refund,
    achievements: knownIds(raw.achievements, known.achievements),
    tracked: parseTracked(raw.tracked),
    unlocks: knownIds(raw.unlocks, known.unlocks),
    recipes: knownIds(raw.recipes, known.skills),
  };
}
