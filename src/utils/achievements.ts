import type { Achievement, GoalProgress, GoalSource } from "../types/achievement";

/** how far a goal has come, the count capped at what it needs */
export function goalProgress(a: Achievement, src: GoalSource): GoalProgress {
  const g = a.goal;
  const have =
    g.kind === "count"
      ? src.stats.counts[g.stat]
      : g.kind === "best"
        ? src.stats.best[g.stat]
        : g.kind === "heroWave"
          ? (src.stats.heroWave[g.hero] ?? 0)
          : g.kind === "shopLevels"
            ? src.shopLevels
            : src.heroesBought;
  return { have: Math.min(have, g.need), need: g.need };
}

export const isMet = (a: Achievement, src: GoalSource): boolean => {
  const p = goalProgress(a, src);
  return p.have >= p.need;
};

/** achievements whose goal is met but that are not earned yet */
export const newlyMet = (list: readonly Achievement[], earned: ReadonlySet<string>, src: GoalSource): Achievement[] =>
  list.filter((a) => !earned.has(a.id) && isMet(a, src));

/** a hidden achievement shows its name and goal once the one it waits on is earned */
export const isRevealed = (a: Achievement, earned: ReadonlySet<string>): boolean =>
  !a.hiddenUntil || earned.has(a.hiddenUntil);

/** the achievements that count: one for a hero only once that hero is in the game */
export const availableAchievements = (
  list: readonly Achievement[],
  heroIds: readonly string[],
): readonly Achievement[] => list.filter((a) => a.goal.kind !== "heroWave" || heroIds.includes(a.goal.hero));
