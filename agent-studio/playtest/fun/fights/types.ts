import type { PolicyName } from "../../types/bot";
import type { FightKind, FightPlan } from "../defense";

export interface FightRunSpec {
  id: string;
  hero: string;
  policy: PolicyName;
  plan: FightPlan;
}

export type FightEnding = "clear" | "held" | "shattered" | "timeout";

export type StageEnding = "clear" | "fallen" | "timeout";

export type RewardKind = "level" | "pick" | "chest" | "evolution" | "shard";

export interface Hit {
  t: number;
  loss: number;
  windupMs: number | null;
  foe: string | null;
  state: string | null;
}

export interface Reward {
  t: number;
  kind: RewardKind;
}

export interface Recording {
  hits: Hit[];
  rewards: Reward[];
}

export interface RunMeta {
  id: string;
  hero: string;
  attempts: number;
  failures: string[];
  wallSeconds: number;
  pageErrors: string[];
}

export interface FightSetup {
  level: number;
  heroMaxHp: number;
  picks: string[];
  chests: string[];
}

export interface FightOutcome {
  ending: FightEnding;
  arrivedAt: number | null;
  fightSeconds: number | null;
  bossMax: number | null;
  bossHpRemoved: number;
  hpLost: number;
  falls: number;
  crystalLost: number;
  hits: Hit[];
  picks: string[];
}

export interface FightRecord extends FightOutcome {
  kind: "fight";
  policy: PolicyName;
  fight: string;
  stage: string;
  foe: string;
  foeKind: FightKind;
  tier: number;
  designedKillSeconds: number;
  setup: FightSetup;
}

export interface FightRun extends RunMeta, FightRecord {}

export interface StageOutcome {
  ending: StageEnding;
  seconds: number;
  level: number;
  falls: number;
  crystalShare: number;
  rewards: Reward[];
  picks: string[];
}

export interface StageRecord extends StageOutcome {
  kind: "stage";
  stage: string;
}

export interface StageRun extends RunMeta, StageRecord {}

export interface FailedRun {
  kind: "failed";
  id: string;
  hero: string;
  attempts: number;
  failures: string[];
}
