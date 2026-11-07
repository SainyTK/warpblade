import { ACHIEVEMENTS } from "../constants/achievements";
import { HERO_PRICES } from "../constants/heroUnlocks";
import { SHOP_ITEMS } from "../constants/shop";
import { loadBest } from "../services/bestScore";
import { loadMeta, saveMeta } from "../services/metaStorage";
import { isPlaytestSession } from "../services/playtestStart";
import type { TrackedStats } from "../types/achievement";
import type { MetaSave, ShopItem, SkillId } from "../types/shop";
import type { Stats } from "../types/stats";
import { parseMeta } from "../utils/metaSave";
import { metaStats, nextPrice } from "../utils/shop";

/** The one owner of progress kept between runs: the coin bank and what the shop sold. Every change is saved here. */
const meta: MetaSave = parseMeta(loadMeta(), SHOP_ITEMS, {
  heroes: Object.keys(HERO_PRICES),
  achievements: ACHIEVEMENTS.map((a) => a.id),
});
// a save from before achievements kept its best wave under its own key: count it toward the wave goals
meta.tracked.best.wave = Math.max(meta.tracked.best.wave, loadBest());
const listeners = new Set<() => void>();
/** in a co-op room the host plays every hero, each with what its own player bought; null is this browser's own */
let worn: Record<string, number> | null = null;

function changed(): void {
  saveMeta(meta);
  for (const listener of listeners) listener();
}

export const bank = (): number => meta.coins;
export const ownedLevel = (id: string): number => (worn ?? meta.owned)[id] ?? 0;
export const ownsSkill = (id: SkillId): boolean => ownedLevel(id) > 0;
/** the stat bonus every run starts with */
export const metaBonus = (): Partial<Stats> => metaStats(SHOP_ITEMS, worn ?? meta.owned);
/** what this browser bought, for a co-op host to play its hero with */
export const ownedItems = (): Record<string, number> => ({ ...meta.owned });

/** play with another player's purchases until called again with null */
export function wearOwned(owned: Record<string, number> | null): void {
  worn = owned;
}
export const wornOwned = (): Record<string, number> | null => worn;

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

/** the coins to unlock a hero, or null when the hero is free */
export const heroPrice = (id: string): number | null => HERO_PRICES[id] ?? null;
/** a free hero, one bought, or any hero in a playtest session */
export const heroUnlocked = (id: string): boolean =>
  heroPrice(id) === null || meta.heroes.includes(id) || isPlaytestSession();
export const heroesBought = (): number => meta.heroes.length;
/** levels and skills bought in the shop, all counted */
export const shopLevels = (): number => Object.values(meta.owned).reduce((sum, level) => sum + level, 0);

/** unlock a hero with coins; false when it is free, already unlocked or the bank is short */
export function buyHero(id: string): boolean {
  const price = heroPrice(id);
  if (price === null || heroUnlocked(id) || price > meta.coins) return false;
  meta.coins -= price;
  meta.heroes.push(id);
  changed();
  return true;
}

/** the tracked stats and earned achievements as last saved */
export const savedTracked = (): TrackedStats => meta.tracked;
export const savedAchievements = (): readonly string[] => meta.achievements;

/** keep the tracked stats, and add newly earned achievements with their coins */
export function saveAchievements(tracked: TrackedStats, earned: readonly string[] = [], reward = 0): void {
  meta.tracked = tracked;
  meta.achievements.push(...earned.filter((id) => !meta.achievements.includes(id)));
  meta.coins += Math.max(0, reward);
  changed();
}

/** listen for coins and purchases; returns how to stop listening */
export function onMetaChange(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
