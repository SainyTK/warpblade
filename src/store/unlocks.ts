import type { FusionId } from "../constants/resonance";
import { CHARACTERS } from "../heroes/roster";
import { isPlaytestSession } from "../services/playtestStart";
import type { Discovery } from "../types/unlock";
import { isMet } from "../utils/achievements";
import { allJobs } from "../utils/jobs";
import { goalSource, onFeat } from "./achievements";
import { savedRecipes, savedUnlocks, saveUnlocks } from "./meta";

/**
 * The one owner of discovery across runs: which charms, charm slots and hero jobs are found, which skill evolutions are
 * known, and what was found since the last run began. Goals are checked after every feat the achievements count, so only solo
 * runs find things. A playtest session has everything and knows every recipe, and finds nothing.
 */
let found = new Set(savedUnlocks());
let recipes = new Set(savedRecipes());
/** found since the last run began, for the end of run screen */
let sinceRunStart: Discovery[] = [];
const listeners = new Set<(d: Discovery) => void>();

/** the player has made this skill's evolution once, so its partner shows */
export const knowsRecipe = (id: string): boolean => isPlaytestSession() || recipes.has(id);
/** an unlock found, by id; every one in a playtest session */
export const isFound = (id: string): boolean => isPlaytestSession() || found.has(id);
export const unlockedThisRun = (): readonly Discovery[] => sinceRunStart;

function discover(d: Discovery): void {
  sinceRunStart = [...sinceRunStart, d];
  for (const listener of listeners) listener(d);
}

/** the hero has made a skill's evolution: its partner shows from now on */
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

/** a new run begins: the end of run screen lists only what this run finds */
export function startRunUnlocks(): void {
  sinceRunStart = [];
}

/** listen for each charm, slot, recipe or job as it is found */
export function onDiscovery(listener: (d: Discovery) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** find every unlock and every hero job whose goal is met */
function check(): void {
  if (isPlaytestSession()) return;
  const src = goalSource();
  const jobs = allJobs(CHARACTERS).filter((j) => !found.has(j.job.unlock.id) && isMet(j.job.unlock, src));
  if (!jobs.length) return;
  const ids = jobs.map((j) => j.job.unlock.id);
  found = new Set([...found, ...ids]);
  saveUnlocks(ids, []);
  for (const j of jobs) discover({ type: "job", ...j });
}
onFeat(check);
// a save from before unlocks can already meet goals, such as a wave long since reached
check();
