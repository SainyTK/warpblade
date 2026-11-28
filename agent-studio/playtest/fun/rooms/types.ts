import type { PolicyName } from "../../types/bot";

export interface PlanStep {
  level: number;
  chests: number;
  least: number;
}

export interface RoomPlan {
  id: string;
  stage: string;
  stageName: string;
  boss: string;
  bossName: string;
  tier: number;
  section: number;
  level: number;
  hearts: number;
  manas: number;
  steps: PlanStep[];
}

export interface RoomRunSpec {
  id: string;
  hero: string;
  policy: PolicyName;
  plan: RoomPlan;
}

export type Ending = "clear" | "fallen" | "timeout";

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

export interface RoomSetup {
  designedKillSeconds: number;
  heroMaxHp: number;
  picks: string[];
  chests: string[];
}

export interface RoomOutcome {
  ending: Ending;
  roomSeconds: number;
  fightSeconds: number | null;
  bossMax: number | null;
  bossHpRemoved: number;
  hpLost: number;
  hits: Hit[];
  picks: string[];
}

export interface RoomRecord extends RoomOutcome {
  kind: "room";
  policy: PolicyName;
  room: string;
  stage: string;
  boss: string;
  tier: number;
  level: number;
  setup: RoomSetup;
}

export interface RoomRun extends RunMeta, RoomRecord {}

export interface StageOutcome {
  ending: Ending;
  seconds: number;
  level: number;
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

export interface TrailInfo {
  gate: number | null;
  bossHp: number | null;
  bossMax: number | null;
  mode: string;
  heroX: number;
  heroY: number;
  heroHp: number;
  heroMaxHp: number;
  dead: boolean;
  won: boolean;
}

export interface Wall {
  x0: number;
  x1: number;
  y: number;
}
