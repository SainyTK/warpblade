import type { FusionId } from "../constants/resonance";
import { hyperUnlockId, stageUnlockId, UNLOCKS } from "../constants/unlocks";
import { CHARACTERS } from "../heroes/roster";
import { isPlaytestSession } from "../services/playtestStart";
import type { PickToolKey } from "../types/build";
import type { ArtId, StageId } from "../types/campaign";
import type { Discovery, UnlockDef, UnlockState } from "../types/unlock";
import { isMet } from "../utils/achievements";
import { allJobs } from "../utils/jobs";
import { goalSource, onFeat } from "./achievements";
import { bank, savedRecipes, savedUnlocks, saveUnlocks, spendCoins } from "./meta";

let found = new Set(savedUnlocks());
let recipes = new Set(savedRecipes());
let sinceRunStart: Discovery[] = [];
const listeners = new Set<(d: Discovery) => void>();

export const knowsRecipe = (id: string): boolean => isPlaytestSession() || recipes.has(id);
export const isFound = (id: string): boolean => isPlaytestSession() || found.has(id);
export const unlockedThisRun = (): readonly Discovery[] => sinceRunStart;

function discover(d: Discovery): void {
  sinceRunStart = [...sinceRunStart, d];
  for (const listener of listeners) listener(d);
}

export function learnRecipe(id: string): void {
  if (isPlaytestSession() || recipes.has(id)) return;
  recipes = new Set([...recipes, id]);
  saveUnlocks([], [id]);
  discover({ type: "recipe", skill: id });
}

const fusionKey = (id: FusionId): string => `fusion:${id}`;

export const knowsFusion = (id: FusionId): boolean => isPlaytestSession() || recipes.has(fusionKey(id));

export function learnFusion(id: FusionId): void {
  const key = fusionKey(id);
  if (isPlaytestSession() || recipes.has(key)) return;
  recipes = new Set([...recipes, key]);
  saveUnlocks([], [key]);
  discover({ type: "fusion", id });
}

export function startRunUnlocks(): void {
  sinceRunStart = [];
}

export function onDiscovery(listener: (d: Discovery) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function unlockState(def: UnlockDef): UnlockState {
  if (isFound(def.id)) return "found";
  return def.price !== undefined && isMet(def, goalSource()) ? "forSale" : "locked";
}

const unlockById = (id: string): UnlockDef | undefined => UNLOCKS.find((u) => u.id === id);

export function buyUnlock(id: string): boolean {
  const def = unlockById(id);
  if (!def || def.price === undefined || unlockState(def) !== "forSale" || def.price > bank()) return false;
  if (!spendCoins(def.price)) return false;
  found = new Set([...found, def.id]);
  saveUnlocks([def.id], []);
  return true;
}

export function isStageOpen(stage: StageId): boolean {
  const def = unlockById(stageUnlockId(stage));
  return !def || isFound(def.id);
}

export const hyperUnlock = (stage: StageId): UnlockDef | undefined => unlockById(hyperUnlockId(stage));

export function foundArts(): ArtId[] {
  return UNLOCKS.flatMap((u) => (u.reward.kind === "art" && isFound(u.id) ? [u.reward.art] : []));
}

export function foundTools(): Partial<Record<PickToolKey, number>> {
  const tools: Partial<Record<PickToolKey, number>> = {};
  for (const u of UNLOCKS)
    if (u.reward.kind === "pickTool" && isFound(u.id))
      tools[u.reward.tool] = (tools[u.reward.tool] ?? 0) + u.reward.amount;
  return tools;
}

let announced = new Set(UNLOCKS.filter((u) => u.price !== undefined && isMet(u, goalSource())).map((u) => u.id));

function check(): void {
  if (isPlaytestSession()) return;
  const src = goalSource();
  const jobs = allJobs(CHARACTERS).filter((j) => !found.has(j.job.unlock.id) && isMet(j.job.unlock, src));
  const free = UNLOCKS.filter((u) => u.price === undefined && !found.has(u.id) && isMet(u, src));
  const sale = UNLOCKS.filter((u) => u.price !== undefined && !announced.has(u.id) && isMet(u, src));
  const ids = [...jobs.map((j) => j.job.unlock.id), ...free.map((u) => u.id)];
  if (ids.length) {
    found = new Set([...found, ...ids]);
    saveUnlocks(ids, []);
  }
  announced = new Set([...announced, ...sale.map((u) => u.id)]);
  for (const j of jobs) discover({ type: "job", ...j });
  for (const unlock of free) discover({ type: "unlock", unlock, forSale: false });
  for (const unlock of sale) discover({ type: "unlock", unlock, forSale: true });
}
onFeat(check);
check();
