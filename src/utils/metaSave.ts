import type { MetaSave, ShopItem } from "../types/shop";
import { maxLevel } from "./shop";

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const count = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) && v > 0 ? Math.floor(v) : 0);

const emptyMeta = (): MetaSave => ({ coins: 0, owned: {} });

/** read saved meta progress, keeping only known items within their levels; anything unreadable starts fresh */
export function parseMeta(raw: unknown, items: readonly ShopItem[]): MetaSave {
  if (!isRecord(raw)) return emptyMeta();
  const saved = isRecord(raw.owned) ? raw.owned : {};
  const owned: Record<string, number> = {};
  for (const item of items) {
    const level = Math.min(maxLevel(item), count(saved[item.id]));
    if (level) owned[item.id] = level;
  }
  return { coins: count(raw.coins), owned };
}
