import type { EnemyRank } from "./enemy";
import type { RunOutcome } from "./run";
import type { SkillKind } from "./skill";

/** lifetime totals the achievements count up */
export type CountStat =
  | "kills"
  | "clears"
  | "miniKills"
  | "bossKills"
  | "perfects"
  | "evolutions"
  | "ultimates"
  | "coinsBanked";
/** the best a player has ever done */
export type BestStat = "wave" | "combo";

/** what the game keeps track of across runs for the achievements */
export interface TrackedStats {
  counts: Record<CountStat, number>;
  best: Record<BestStat, number>;
  /** the highest wave cleared with each hero, by hero id */
  heroWave: Record<string, number>;
}

/** what a goal is read from: the tracked stats and what the meta save shows */
export interface GoalSource {
  stats: TrackedStats;
  /** levels and skills bought in the shop */
  shopLevels: number;
  /** heroes unlocked with coins */
  heroesBought: number;
}

export type Goal =
  | { kind: "count"; stat: CountStat; need: number }
  | { kind: "best"; stat: BestStat; need: number }
  | { kind: "heroWave"; hero: string; need: number }
  | { kind: "shopLevels"; need: number }
  | { kind: "heroesBought"; need: number };

export type AchievementGroup = "Waves" | "Heroes" | "Foes" | "Skill" | "Coins";

export interface Achievement {
  id: string;
  name: string;
  /** what to do, shown while it is not earned yet */
  text: string;
  group: AchievementGroup;
  goal: Goal;
  /** coins added to the bank when it is earned */
  reward: number;
  /** shown as ??? until this achievement is earned */
  hiddenUntil?: string;
}

/** how far a goal has come */
export interface GoalProgress {
  have: number;
  need: number;
}

/** something that happened in play that an achievement may count */
export type Feat =
  | { kind: "kill"; rank: EnemyRank }
  | { kind: "waveReached"; wave: number }
  | { kind: "waveCleared"; wave: number; hero: string }
  | { kind: "runEnd"; outcome: RunOutcome; wave: number; hero: string }
  | { kind: "comboHit"; moves: number }
  | { kind: "perfect" }
  | { kind: "learned"; skill: SkillKind }
  | { kind: "banked"; coins: number };
