import type { SourceId } from "./build";
import type { EnemyRank } from "./enemy";
import type { RunOutcome } from "./run";

/** lifetime totals the achievements count up */
export type CountStat =
  | "kills"
  | "clears"
  | "miniKills"
  | "bossKills"
  | "perfects"
  | "evolutions"
  | "ultimates"
  | "coinsBanked"
  | "chests"
  | "flowFulls";
/** the best a player has ever done; the `run` ones are the most in one run */
export type BestStat =
  | "wave"
  | "combo"
  | "skillLevel"
  | "chestUpgrades"
  | "runPerfects"
  | "runSkillKills"
  /** the most foes Orrin's swing kicks defeated in one swing, from latch to letting go */
  | "swingKills"
  /** the most foes defeated inside one of Mirel's Stillfields, from open to close */
  | "fieldKills"
  /** the most foes Wenna's Wicks defeated in one run */
  | "wickKills";

/** what the run in play has counted so far, for the goals met within one run */
export interface RunTally {
  perfects: number;
  /** kills by a skill's own hits */
  skillKills: number;
}

/** what the game keeps track of across runs for the achievements and unlocks */
export interface TrackedStats {
  counts: Record<CountStat, number>;
  best: Record<BestStat, number>;
  /** the highest wave cleared with each hero, by hero id */
  heroWave: Record<string, number>;
  /** the run in play; a save never brings it back */
  run: RunTally;
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

/** something that happened in play that an achievement or an unlock may count */
export type Feat =
  | { kind: "kill"; rank: EnemyRank; source?: SourceId }
  | { kind: "waveReached"; wave: number }
  | { kind: "waveCleared"; wave: number; hero: string }
  | { kind: "runEnd"; outcome: RunOutcome; wave: number; hero: string }
  | { kind: "comboHit"; moves: number }
  | { kind: "perfect" }
  | { kind: "ultimateLearned" }
  | { kind: "banked"; coins: number }
  | { kind: "skillLevel"; skill: string; level: number }
  | { kind: "evolved"; skill: string }
  | { kind: "chestOpened"; upgrades: number }
  | { kind: "flowFull" }
  | { kind: "swingKills"; kills: number }
  | { kind: "fieldKills"; kills: number }
  | { kind: "wickKills"; kills: number };
