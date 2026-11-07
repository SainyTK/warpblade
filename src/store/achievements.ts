import { ACHIEVEMENTS } from "../constants/achievements";
import { CHARACTERS } from "../constants/characters";
import { isPlaytestSession } from "../services/playtestStart";
import type { Achievement, Feat, GoalSource, TrackedStats } from "../types/achievement";
import { availableAchievements, newlyMet } from "../utils/achievements";
import { applyFeat, emptyRun } from "../utils/trackedStats";
import { heroesBought, onMetaChange, saveAchievements, savedAchievements, savedTracked, shopLevels } from "./meta";

/**
 * The one owner of achievement tracking: the stats counted in play, which achievements are earned, and those earned
 * since the last run began. Stats are saved at wave and run ends; an earned achievement saves at once with its coins.
 */
let stats: TrackedStats = savedTracked();
let earned = new Set(savedAchievements());
/** earned since the last run began, for the result screen */
let sinceRunStart: Achievement[] = [];
const listeners = new Set<(a: Achievement) => void>();
const featListeners = new Set<() => void>();

/** the achievements the game has now: one for a hero only once that hero is in */
export const allAchievements = (): readonly Achievement[] =>
  availableAchievements(
    ACHIEVEMENTS,
    CHARACTERS.map((c) => c.id),
  );
export const isEarned = (id: string): boolean => earned.has(id);
export const earnedIds = (): ReadonlySet<string> => earned;
export const goalSource = (): GoalSource => ({ stats, shopLevels: shopLevels(), heroesBought: heroesBought() });
export const runAchievements = (): readonly Achievement[] => sinceRunStart;

/** earn every achievement whose goal is met, adding its coins; true when one was earned */
function check(): boolean {
  const met = newlyMet(allAchievements(), earned, goalSource());
  if (!met.length) return false;
  earned = new Set([...earned, ...met.map((a) => a.id)]);
  sinceRunStart = [...sinceRunStart, ...met];
  saveAchievements(
    stats,
    met.map((a) => a.id),
    met.reduce((sum, a) => sum + a.reward, 0),
  );
  for (const a of met) for (const listener of listeners) listener(a);
  return true;
}

/** something happened in play; a playtest bot's runs count for nothing */
export function recordFeat(feat: Feat): void {
  if (isPlaytestSession()) return;
  stats = applyFeat(stats, feat);
  const ends = feat.kind === "waveCleared" || feat.kind === "runEnd" || feat.kind === "banked";
  if (!check() && ends) saveAchievements(stats);
  for (const listener of featListeners) listener();
}

/** a new run begins: the result screen lists only what this run earns, and the run's own counts start over */
export function startRunAchievements(): void {
  sinceRunStart = [];
  stats = { ...stats, run: emptyRun() };
}

/** listen for every feat counted, after the stats have taken it in; the unlocks check their goals here */
export function onFeat(listener: () => void): () => void {
  featListeners.add(listener);
  return () => featListeners.delete(listener);
}

/** listen for each achievement as it is earned */
export function onAchievement(listener: (a: Achievement) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// buying in the shop or unlocking a hero can meet a goal too
let checking = false;
function checkOnce(): void {
  if (checking || isPlaytestSession()) return;
  checking = true;
  check();
  checking = false;
}
onMetaChange(checkOnce);
// a save from an older version can already meet goals it never earned
checkOnce();
