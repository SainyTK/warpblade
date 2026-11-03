import { SHOP_ITEMS } from "../constants/shop";
import { loadMeta, saveMeta } from "../services/metaStorage";
import type { MetaSave, ShopItem, SkillId } from "../types/shop";
import type { Stats } from "../types/stats";
import { parseMeta } from "../utils/metaSave";
import { metaStats, nextPrice } from "../utils/shop";

/** The one owner of progress kept between runs: the coin bank and what the shop sold. Every change is saved here. */
const meta: MetaSave = parseMeta(loadMeta(), SHOP_ITEMS);
const listeners = new Set<() => void>();

function changed(): void {
  saveMeta(meta);
  for (const listener of listeners) listener();
}

export const bank = (): number => meta.coins;
export const ownedLevel = (id: string): number => meta.owned[id] ?? 0;
export const ownsSkill = (id: SkillId): boolean => ownedLevel(id) > 0;
/** the stat bonus every run starts with */
export const metaBonus = (): Partial<Stats> => metaStats(SHOP_ITEMS, meta.owned);

export function addCoins(amount: number): void {
  if (amount <= 0) return;
  meta.coins += amount;
  changed();
}

/** buy the next level of an item; false when it is maxed or the bank is short */
export function buy(item: ShopItem): boolean {
  const price = nextPrice(item, ownedLevel(item.id));
  if (price === null || price > meta.coins) return false;
  meta.coins -= price;
  meta.owned[item.id] = ownedLevel(item.id) + 1;
  changed();
  return true;
}

export function onMetaChange(listener: () => void): void {
  listeners.add(listener);
}
