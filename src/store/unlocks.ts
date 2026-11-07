import { CHARM_SLOTS } from "../constants/growth";
import { isPlaytestSession } from "../services/playtestStart";
import type { CharmId } from "../types/build";
import type { Discovery } from "../types/unlock";
import { charmOpen, newlyFound, slotCount } from "../utils/unlocks";
import { goalSource, onFeat } from "./achievements";
import { savedRecipes, savedUnlocks, saveUnlocks } from "./meta";

/**
 * The one owner of discovery across runs: which charms and charm slots are found, which skill evolutions are known,
 * and what was found since the last run began. Goals are checked after every feat the achievements count, so only solo
 * runs find things. A playtest session has everything and knows every recipe, and finds nothing.
 */
let found = new Set(savedUnlocks());
let recipes = new Set(savedRecipes());
/** found since the last run began, for the end of run screen */
let sinceRunStart: Discovery[] = [];
const listeners = new Set<(d: Discovery) => void>();

export const charmUnlocked = (id: CharmId): boolean => isPlaytestSession() || charmOpen(id, found);
export const charmSlots = (): number => (isPlaytestSession() ? CHARM_SLOTS : slotCount(found));
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

/** a new run begins: the end of run screen lists only what this run finds */
export function startRunUnlocks(): void {
  sinceRunStart = [];
}

/** listen for each charm, slot or recipe as it is found */
export function onDiscovery(listener: (d: Discovery) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** find every unlock whose goal is met */
function check(): void {
  if (isPlaytestSession()) return;
  const met = newlyFound(found, goalSource());
  if (!met.length) return;
  found = new Set([...found, ...met.map((u) => u.id)]);
  saveUnlocks(
    met.map((u) => u.id),
    [],
  );
  for (const unlock of met) discover({ type: "unlock", unlock });
}
onFeat(check);
// a save from before unlocks can already meet goals, such as a wave long since reached
check();
