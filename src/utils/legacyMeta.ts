import {
  LEGACY_PRICE_GROWTH,
  LEGACY_PRICE_ROUND,
  LEGACY_REMOVED_HERO_PRICES,
  LEGACY_SHOP_PRICES,
} from "../constants/legacyShop";
import type { ArmoryItem, LegacyShopPrice } from "../types/armory";
import { count, isRecord } from "./saveFields";

const legacyLevelPrice = (price: LegacyShopPrice, level: number): number =>
  Math.round((price.firstPrice * LEGACY_PRICE_GROWTH ** level) / LEGACY_PRICE_ROUND) * LEGACY_PRICE_ROUND;

function legacyPaid(price: LegacyShopPrice, from: number, to: number): number {
  let paid = 0;
  for (let level = from; level < to; level++) paid += legacyLevelPrice(price, level);
  return paid;
}

interface UpgradedOwned {
  owned: Record<string, number>;
  spentOnOwned: number;
  refund: number;
}

function upgradeOwned(raw: unknown, items: readonly ArmoryItem[]): UpgradedOwned {
  const saved = isRecord(raw) ? raw : {};
  const upgraded: UpgradedOwned = { owned: {}, spentOnOwned: 0, refund: 0 };
  for (const [id, price] of Object.entries(LEGACY_SHOP_PRICES)) {
    const bought = Math.min(price.levels, count(saved[id]));
    const kept = Math.min(bought, items.find((item) => item.id === id)?.levels ?? 0);
    if (kept) upgraded.owned[id] = kept;
    upgraded.spentOnOwned += legacyPaid(price, 0, kept);
    upgraded.refund += legacyPaid(price, kept, bought);
  }
  return upgraded;
}

const removedHeroRefund = (heroes: unknown): number =>
  Array.isArray(heroes)
    ? Object.entries(LEGACY_REMOVED_HERO_PRICES).reduce(
        (sum, [id, price]) => sum + (heroes.includes(id) ? price : 0),
        0,
      )
    : 0;

export function upgradeLegacyMeta(
  raw: unknown,
  items: readonly ArmoryItem[],
  itemUnlockId: (item: string) => string,
): Record<string, unknown> | null {
  if (!isRecord(raw)) return null;
  const { owned, spentOnOwned, refund } = upgradeOwned(raw.owned, items);
  const unlocks = Array.isArray(raw.unlocks) ? raw.unlocks : [];
  return {
    ...raw,
    coins: count(raw.coins) + refund + removedHeroRefund(raw.heroes),
    owned,
    spentOnOwned,
    unlocks: [...unlocks, ...Object.keys(owned).map(itemUnlockId)],
  };
}
