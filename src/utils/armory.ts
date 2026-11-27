import { NO_ARMORY_RATES, PRICE_RISE_PER_PURCHASE, PRICE_ROUND } from "../constants/armory";
import type { ArmoryItem, ArmoryRates } from "../types/armory";
import type { PickToolKey } from "../types/build";
import type { Stats } from "../types/stats";

export type Levels = Readonly<Record<string, number>>;

export const levelsBought = (levels: Levels): number => Object.values(levels).reduce((sum, level) => sum + level, 0);

export function nextPrice(item: ArmoryItem, level: number, bought: number): number | null {
  if (level >= item.levels) return null;
  const raw = item.firstPrice * (level + 1) * (1 + PRICE_RISE_PER_PURCHASE * bought);
  return Math.round(raw / PRICE_ROUND) * PRICE_ROUND;
}

export function priceOfAll(items: readonly ArmoryItem[], levels: Levels): number {
  let bought = 0;
  let total = 0;
  for (const item of items) {
    for (let level = 0; level < (levels[item.id] ?? 0); level++) {
      total += nextPrice(item, level, bought) ?? 0;
      bought++;
    }
  }
  return total;
}

export function armoryStats(items: readonly ArmoryItem[], levels: Levels): Partial<Stats> {
  const bonus: Partial<Stats> = {};
  for (const item of items) {
    const level = levels[item.id] ?? 0;
    if (item.kind === "stat" && level) bonus[item.stat] = (bonus[item.stat] ?? 0) + item.perLevel * level;
  }
  return bonus;
}

export function armoryTools(items: readonly ArmoryItem[], levels: Levels): Partial<Record<PickToolKey, number>> {
  const bonus: Partial<Record<PickToolKey, number>> = {};
  for (const item of items)
    if (item.kind === "tool") bonus[item.tool] = (bonus[item.tool] ?? 0) + (levels[item.id] ?? 0);
  return bonus;
}

export function armoryRates(items: readonly ArmoryItem[], levels: Levels): ArmoryRates {
  const rates = { ...NO_ARMORY_RATES };
  for (const item of items) {
    const level = levels[item.id] ?? 0;
    if (item.kind !== "fortune" || !level) continue;
    for (const key of Object.keys(item.perLevel) as (keyof ArmoryRates)[])
      rates[key] += (item.perLevel[key] ?? 0) * level;
  }
  return rates;
}
