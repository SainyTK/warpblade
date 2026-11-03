import { PRICE_GROWTH, PRICE_ROUND } from "../constants/shop";
import type { ShopItem } from "../types/shop";
import type { Stats } from "../types/stats";

/** how many times an item can be bought: every level of a stat, a skill once */
export const maxLevel = (item: ShopItem): number => (item.kind === "stat" ? item.levels : 1);

/** the price of the next level after `level`, or null once the item is maxed */
export function nextPrice(item: ShopItem, level: number): number | null {
  if (level >= maxLevel(item)) return null;
  return Math.round((item.price * PRICE_GROWTH ** level) / PRICE_ROUND) * PRICE_ROUND;
}

/** the flat stat bonus from every stat level owned */
export function metaStats(items: readonly ShopItem[], owned: Readonly<Record<string, number>>): Partial<Stats> {
  const bonus: Partial<Stats> = {};
  for (const item of items) {
    if (item.kind !== "stat") continue;
    const level = owned[item.id] ?? 0;
    if (level) bonus[item.stat] = (bonus[item.stat] ?? 0) + item.per * level;
  }
  return bonus;
}
