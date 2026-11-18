import type { Achievement, Goal, GoalProgress, GoalSource } from "../types/achievement";

/** what a goal has counted so far */
function goalCount(g: Goal, src: GoalSource): number {
  switch (g.kind) {
    case "count":
      return src.stats.counts[g.stat];
    case "best":
      return src.stats.best[g.stat];
    case "heroWave":
      return src.stats.heroWave[g.hero] ?? 0;
    case "foeKills":
      return src.stats.foes[g.foe] ?? 0;
    case "hero":
      return src.stats.hero[g.stat] ?? 0;
    case "shopLevels":
      return src.shopLevels;
    case "heroesBought":
      return src.heroesBought;
  }
}

/** how far the goal of an achievement or an unlock has come, the count capped at what it needs */
export function goalProgress(a: { goal: Goal }, src: GoalSource): GoalProgress {
  return { have: Math.min(goalCount(a.goal, src), a.goal.need), need: a.goal.need };
}

export const isMet = (a: { goal: Goal }, src: GoalSource): boolean => {
  const p = goalProgress(a, src);
  return p.have >= p.need;
};

/** achievements whose goal is met but that are not earned yet */
export const newlyMet = (list: readonly Achievement[], earned: ReadonlySet<string>, src: GoalSource): Achievement[] =>
  list.filter((a) => !earned.has(a.id) && isMet(a, src));

/** a hidden achievement shows its name and goal once the one it waits on is earned */
export const isRevealed = (a: Achievement, earned: ReadonlySet<string>): boolean =>
  !a.hiddenUntil || earned.has(a.hiddenUntil);
