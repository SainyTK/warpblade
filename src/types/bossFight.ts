import type { Color } from "./color";
import type { Enemy, EnemyState, EnemyType } from "./enemy";

export interface BossCombo {
  states: readonly EnemyState[];
  chance: number;
  cast(e: Enemy): void;
}

export interface BossProfile {
  epithet: string;
  hp: number;
  power: number;
  phaseAt: number;
  light: Color;
  adds: readonly EnemyType[];
  combo: BossCombo;
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
}
