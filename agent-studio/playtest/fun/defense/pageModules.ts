import type { BigFoeKind, DefenseEnd } from "./types";

export interface FoeFields {
  type: string;
  hp: number;
  max: number;
}

export interface DefenseFields {
  stage: { id: string; name: string; boss: string };
  elapsed: number;
  end: DefenseEnd | null;
  crystal: { x: number; hp: number; max: number; lastHitAt: number };
  bigFoes: { foe: FoeFields; kind: BigFoeKind }[];
  bigFoeCall: number;
  packIn: number;
}

export interface DefenseModule {
  defense: DefenseFields | null;
}

export interface StateModule {
  game: { mode: string; t: number; enemies: FoeFields[]; fx: { rift?: unknown }[] };
  hero: { x: number; y: number; hp: number; state: string };
  progress: { level: number; picks: number; stats: { hp: number } };
}

export interface BigFoeCallFields {
  at: number;
  kind: BigFoeKind;
}

export interface FrontFields {
  from: number;
  sides: readonly string[];
}

export interface DefenseRulesModule {
  BIG_FOE_CALLS: readonly BigFoeCallFields[];
  BIG_FOE_XP_SECONDS: Record<BigFoeKind, number>;
  SIDE_STYLE: Record<string, { eliteEvery: number }>;
}

export interface ClockModule {
  levelAtSecond(seconds: number): number;
  foesPerSecond(seconds: number): number;
  frontAt(seconds: number): FrontFields;
}

export interface ProgressionModule {
  xpToReach(level: number): number;
}

export interface GrowthModule {
  MAX_LEVEL: number;
}

export interface StageFields {
  id: string;
  name: string;
  boss: string;
  mini: { name: string; base: string };
}

export interface StagesModule {
  STAGES: Record<string, StageFields>;
}

export interface StageTierModule {
  STAGE_TIER: Record<string, number>;
}

export interface StageArcModule {
  TIME_TO_KILL: Record<BigFoeKind, number>;
}

export interface StageModsModule {
  stageMods(stage: StageFields, hyper: boolean): { hp: number; crowd: number; eliteEvery: number };
}

export interface VitalsModule {
  SHARD_DROP: { eliteChance: number; minionChance: number };
}

export interface EnemiesModule {
  ENEMIES: Record<string, { name: string }>;
}
