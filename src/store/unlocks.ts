import type { FusionId } from "../constants/resonance";
import {
  fusionRecipeId,
  heroUnlockId,
  hyperUnlockId,
  itemUnlockId,
  STARTER_SKILLS,
  skillUnlockId,
  stageUnlockId,
  UNLOCKS,
} from "../constants/unlocks";
import { CHARACTERS, type HeroId } from "../heroes/roster";
import { isPlaytestSession } from "../services/playtestStart";
import type { PickToolKey } from "../types/build";
import type { ArtId, StageId } from "../types/campaign";
import type { Discovery, GoalStep, UnlockDef, UnlockState } from "../types/unlock";
import { goalProgress, isMet } from "../utils/achievements";
import { allJobs } from "../utils/jobs";
import { closestSteps } from "../utils/unlocks";
import { goalSource, onFeat } from "./achievements";
import { bank, onMetaChange, savedRecipes, savedUnlocks, saveUnlocks, spendCoins } from "./meta";

let found = new Set(savedUnlocks());
let recipes = new Set(savedRecipes());
let sinceRunStart: Discovery[] = [];
let haveAtRunStart = new Map<string, number>();
let wornSkills: ReadonlySet<string> | null = null;
const listeners = new Set<(d: Discovery) => void>();

export const knowsRecipe = (id: string): boolean => isPlaytestSession() || recipes.has(id);
export const isFound = (id: string): boolean => isPlaytestSession() || found.has(id);
export const unlockedThisRun = (): readonly Discovery[] => sinceRunStart;

const unlockById = (id: string): UnlockDef | undefined => UNLOCKS.find((u) => u.id === id);

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

export const knowsFusion = (id: FusionId): boolean => isPlaytestSession() || recipes.has(fusionRecipeId(id));

export function learnFusion(id: FusionId): void {
  const key = fusionRecipeId(id);
  if (isPlaytestSession() || recipes.has(key)) return;
  recipes = new Set([...recipes, key]);
  saveUnlocks([], [key]);
  discover({ type: "fusion", id });
}

export function onDiscovery(listener: (d: Discovery) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const heroUnlock = (hero: string): UnlockDef | undefined => unlockById(heroUnlockId(hero));

export function heroUnlocked(hero: string): boolean {
  const def = heroUnlock(hero);
  return !def || isFound(def.id);
}

const waitsOnHero = (def: UnlockDef): boolean => def.reward.kind === "skill" && !heroUnlocked(def.reward.hero);

export function unlockState(def: UnlockDef): UnlockState {
  if (isFound(def.id)) return "found";
  if (def.price === undefined || waitsOnHero(def)) return "locked";
  return isMet(def, goalSource()) ? "forSale" : "locked";
}

export const unlockProgress = (def: UnlockDef): { have: number; need: number } => goalProgress(def, goalSource());

export function buyUnlock(id: string): boolean {
  const def = unlockById(id);
  if (!def || def.price === undefined || unlockState(def) !== "forSale" || def.price > bank()) return false;
  found = new Set([...found, def.id]);
  if (!spendCoins(def.price)) {
    found.delete(def.id);
    return false;
  }
  saveUnlocks([def.id], []);
  return true;
}

export function isStageOpen(stage: StageId): boolean {
  const def = unlockById(stageUnlockId(stage));
  return !def || isFound(def.id);
}

export const hyperUnlock = (stage: StageId): UnlockDef | undefined => unlockById(hyperUnlockId(stage));

export const itemUnlock = (item: string): UnlockDef | undefined => unlockById(itemUnlockId(item));
export const itemShown = (item: string): boolean => isFound(itemUnlockId(item));

export const skillUnlock = (skill: string): UnlockDef | undefined => unlockById(skillUnlockId(skill));

function ownSkillOpen(skill: string): boolean {
  const def = skillUnlock(skill);
  return !def || isFound(def.id);
}

export const isSkillOpen = (skill: string): boolean => (wornSkills ? wornSkills.has(skill) : ownSkillOpen(skill));

export const isStarterSkill = (hero: string, skill: string): boolean =>
  (STARTER_SKILLS[hero as HeroId] ?? []).includes(skill);

export const openSkills = (): string[] =>
  CHARACTERS.flatMap((c) => c.skills.filter((s) => ownSkillOpen(s.id)).map((s) => s.id));

export function wearSkills(skills: readonly string[] | null): void {
  wornSkills = skills ? new Set(skills) : null;
}

export const forSale = (kind: UnlockDef["reward"]["kind"]): UnlockDef[] =>
  UNLOCKS.filter((u) => u.reward.kind === kind && unlockState(u) === "forSale");

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

const pending = (): UnlockDef[] => UNLOCKS.filter((u) => !isFound(u.id) && !waitsOnHero(u));

export function startRunUnlocks(): void {
  sinceRunStart = [];
  const src = goalSource();
  haveAtRunStart = new Map(pending().map((u) => [u.id, goalProgress(u, src).have]));
}

export function closestGoals(count: number): GoalStep[] {
  const src = goalSource();
  const open = pending().filter((u) => !u.secret && !(u.price !== undefined && isMet(u, src)));
  return closestSteps(open, src, haveAtRunStart, count);
}

let announced = new Set(UNLOCKS.filter((u) => u.price !== undefined && isMet(u, goalSource())).map((u) => u.id));
let checking = false;

function check(): void {
  if (isPlaytestSession() || checking) return;
  checking = true;
  const src = goalSource();
  const jobs = allJobs(CHARACTERS).filter((j) => !found.has(j.job.unlock.id) && isMet(j.job.unlock, src));
  const open = pending();
  const free = open.filter((u) => u.price === undefined && isMet(u, src));
  const sale = open.filter((u) => u.price !== undefined && !announced.has(u.id) && isMet(u, src));
  const ids = [...jobs.map((j) => j.job.unlock.id), ...free.map((u) => u.id)];
  announced = new Set([...announced, ...sale.map((u) => u.id)]);
  if (ids.length) {
    found = new Set([...found, ...ids]);
    saveUnlocks(ids, []);
  }
  for (const j of jobs) discover({ type: "job", ...j });
  for (const unlock of free) discover({ type: "unlock", unlock, forSale: false });
  for (const unlock of sale) discover({ type: "unlock", unlock, forSale: true });
  checking = false;
  if (ids.length) check();
}
onFeat(check);
onMetaChange(check);
check();
