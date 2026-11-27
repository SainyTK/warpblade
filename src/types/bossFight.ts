import type { Color } from "./color";
import type { Enemy, EnemyState, EnemyType } from "./enemy";

export interface BossCombo {
  states: readonly EnemyState[];
  chance: number;
  cast(e: Enemy): void;
}

export interface BossSignature {
  every: readonly [calm: number, enraged: number];
  telegraph: number;
  cast(e: Enemy, count: number): void;
}

export interface BossProfile {
  epithet: string;
  power: number;
  light: Color;
  adds: readonly EnemyType[];
  combo?: BossCombo;
  signature?: BossSignature;
  drivesPhase?: boolean;
}

export type BossMoment = "gather" | "entrance" | "fight" | "shift" | "finale" | "over";

export type BossCardTone = "boss" | "art" | "fallen";

export interface BossCard {
  label: string;
  name: string;
  sub: string;
  tone: BossCardTone;
}

export interface BossBar {
  marks: readonly number[];
  phase: number;
  shielded: boolean;
  poise: number;
  broken: boolean;
  enrageIn: number | null;
}

export type BigFoeKind = "elite" | "mini" | "boss";
