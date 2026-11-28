import { ACHIEVEMENTS } from "../constants/achievements";
import { ARMORY_ITEMS } from "../constants/armory";
import { FUSIONS } from "../constants/resonance";
import { fusionRecipeId, heroUnlockId, itemUnlockId, UNLOCKS } from "../constants/unlocks";
import { CHARACTERS } from "../heroes/roster";
import { loadLegacyMeta, loadMeta, saveMeta } from "../services/metaStorage";
import type { GoalSource, TrackedStats } from "../types/achievement";
import type { ArmoryItem, ArmoryRates, GearId, MetaSave } from "../types/armory";
import type { PickToolKey } from "../types/build";
import type { Stats } from "../types/stats";
import type { UnlockReward } from "../types/unlock";
import { armoryRates, armoryStats, armoryTools, type Levels, levelsBought, nextPrice } from "../utils/armory";
import { jobUnlockIds } from "../utils/jobs";
import { upgradeLegacyMeta } from "../utils/legacyMeta";
import { parseMeta } from "../utils/metaSave";
import { ALL_SKILLS } from "../utils/skills";

const saved = loadMeta();
const legacy = saved === null ? upgradeLegacyMeta(loadLegacyMeta(), ARMORY_ITEMS, itemUnlockId) : null;
const meta: MetaSave = parseMeta(saved ?? legacy, ARMORY_ITEMS, {
  achievements: ACHIEVEMENTS.map((a) => a.id),
  unlocks: [...jobUnlockIds(CHARACTERS), ...UNLOCKS.map((u) => u.id)],
  recipes: [...ALL_SKILLS.map((s) => s.id), ...FUSIONS.map((f) => fusionRecipeId(f.id))],
  heroUnlockId,
});
if (legacy) saveMeta(meta);
const listeners = new Set<() => void>();
let worn: Levels | null = null;

function changed(): void {
  saveMeta(meta);
  for (const listener of listeners) listener();
}

export const bank = (): number => meta.coins;
export const ownedLevel = (id: string): number => meta.owned[id] ?? 0;
export const isSwitchedOff = (id: string): boolean => meta.switchedOff.includes(id);
export const armoryBought = (): number => levelsBought(meta.owned);
export const priceOf = (item: ArmoryItem): number | null => nextPrice(item, ownedLevel(item.id), armoryBought());

function ownActiveLevels(): Levels {
  return Object.fromEntries(Object.entries(meta.owned).filter(([id]) => !isSwitchedOff(id)));
}

const activeLevels = (): Levels => worn ?? ownActiveLevels();

export const activeLevel = (id: string): number => activeLevels()[id] ?? 0;
export const hasGear = (id: GearId): boolean => activeLevel(id) > 0;
export const armoryBonus = (): Partial<Stats> => armoryStats(ARMORY_ITEMS, activeLevels());
export const armoryToolBonus = (): Partial<Record<PickToolKey, number>> => armoryTools(ARMORY_ITEMS, activeLevels());
export const runRates = (): ArmoryRates => armoryRates(ARMORY_ITEMS, activeLevels());
export const loadout = (): Levels => ownActiveLevels();

const ROOM_WIDE_ITEMS: readonly string[] = ["curse"];

export function wearLevels(levels: Levels | null): void {
  if (!levels) {
    worn = null;
    return;
  }
  const own = ownActiveLevels();
  const shared = Object.fromEntries(ROOM_WIDE_ITEMS.map((id) => [id, own[id] ?? 0]));
  worn = { ...levels, ...shared };
}

export function addCoins(amount: number): void {
  if (amount <= 0) return;
  meta.coins += amount;
  changed();
}

export function spendCoins(amount: number): boolean {
  if (amount <= 0 || amount > meta.coins) return false;
  meta.coins -= amount;
  changed();
  return true;
}

export function buyLevel(item: ArmoryItem): boolean {
  const price = priceOf(item);
  if (price === null || price > meta.coins) return false;
  meta.coins -= price;
  meta.spentOnOwned += price;
  meta.owned[item.id] = ownedLevel(item.id) + 1;
  changed();
  return true;
}

export function switchItem(id: string, on: boolean): void {
  if (!ownedLevel(id) || isSwitchedOff(id) === !on) return;
  meta.switchedOff = on ? meta.switchedOff.filter((off) => off !== id) : [...meta.switchedOff, id];
  changed();
}

export const refundValue = (): number => meta.spentOnOwned;

export function refundAll(): number {
  const back = meta.spentOnOwned;
  if (!back && !armoryBought()) return 0;
  meta.coins += back;
  meta.spentOnOwned = 0;
  meta.owned = {};
  meta.switchedOff = [];
  changed();
  return back;
}

const foundCount = (kind: UnlockReward["kind"]): number =>
  UNLOCKS.filter((u) => u.reward.kind === kind && meta.unlocks.includes(u.id)).length;

const unlockSpend = (): number =>
  UNLOCKS.reduce((sum, u) => sum + (u.price !== undefined && meta.unlocks.includes(u.id) ? u.price : 0), 0);

export const metaGoals = (): Omit<GoalSource, "stats"> => ({
  armoryLevels: armoryBought(),
  heroesBought: foundCount("hero"),
  skillsFound: foundCount("skill"),
  fusionsFound: FUSIONS.filter((f) => meta.recipes.includes(fusionRecipeId(f.id))).length,
  goldSpent: meta.spentOnOwned + unlockSpend(),
});

export const savedTracked = (): TrackedStats => meta.tracked;
export const savedAchievements = (): readonly string[] => meta.achievements;

export function saveAchievements(tracked: TrackedStats, earned: readonly string[] = [], reward = 0): void {
  meta.tracked = tracked;
  meta.achievements.push(...earned.filter((id) => !meta.achievements.includes(id)));
  meta.coins += Math.max(0, reward);
  changed();
}

export const savedUnlocks = (): readonly string[] => meta.unlocks;
export const savedRecipes = (): readonly string[] => meta.recipes;

export function saveUnlocks(found: readonly string[], recipes: readonly string[]): void {
  meta.unlocks.push(...found.filter((id) => !meta.unlocks.includes(id)));
  meta.recipes.push(...recipes.filter((id) => !meta.recipes.includes(id)));
  changed();
}

export function onMetaChange(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
