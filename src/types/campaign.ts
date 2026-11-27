import type { EraId } from "../constants/eras";
import type { Color } from "./color";
import type { EnemyType } from "./enemy";
import type { Platform, Point } from "./world";

export type StageId =
  | "prologue"
  | "marsh"
  | "moonlit"
  | "veil"
  | "foundry"
  | "glacier"
  | "skyway"
  | "blight"
  | "archive"
  | "citadel";

export type StageKind = "prologue" | "rift" | "citadel";

export type ElementId = "blaze" | "frost" | "storm" | "venom" | "void";

export type ArtId =
  | "mirespit"
  | "gloamlantern"
  | "riftlance"
  | "forgeflare"
  | "rimefang"
  | "galecall"
  | "sporeburst"
  | "inkwave";

export interface Patrol extends Point {
  kind: "ground" | "flyer";
  type?: EnemyType;
  elite?: boolean;
}

export interface SurgeRoom {
  cap: number;
  foes?: readonly EnemyType[];
}

export type ArcBeat =
  | { kind: "surge"; foes: number; to: number }
  | { kind: "elite"; to: number }
  | { kind: "mini"; to: number }
  | { kind: "boss"; foe?: EnemyType; to: number };

export interface AreaArc {
  enter: number;
  gate: number;
  beats: readonly [ArcBeat, ...ArcBeat[]];
}

export type StageTier = 1 | 2 | 3 | 4 | 5;

export interface StageTwist {
  name: string;
  text: string;
  heartChance?: number;
  crowd?: number;
  foeHp?: number;
  foeDamage?: number;
  foePace?: number;
  eliteEvery?: number;
  coins?: number;
}

export type MiniMove = "pillars" | "spikes" | "call";

export interface MiniBossDef {
  name: string;
  epithet: string;
  base: EnemyType;
  light: Color;
  power: number;
  moves: readonly [MiniMove, ...MiniMove[]];
  adds: readonly EnemyType[];
}

export interface Approach {
  room: SurgeRoom;
  parSeconds: number;
  length: number;
  slabs: readonly Platform[];
  walls: readonly Platform[];
  arenaSlabs: readonly Platform[];
  patrol: readonly Patrol[];
  mentorSites: readonly [Point, ...Point[]];
  spikes: readonly Platform[];
  pits?: readonly Platform[];
}

export interface StageHazard {
  reset(): void;
  update(dt: number): void;
  drawBack?(cameraX: number, t: number): void;
  drawFront?(cameraX: number, t: number): void;
}

export interface StageDef {
  id: StageId;
  name: string;
  mapBlurb: string;
  kind: StageKind;
  era: EraId;
  ground: EnemyType;
  flyer: EnemyType;
  boss: EnemyType;
  mini: MiniBossDef;
  twist: StageTwist;
  grantsArt?: ArtId;
  weakTo?: ArtId;
  areas: readonly [Approach, ...Approach[]];
  hazard?: StageHazard;
}

export interface StageChoice {
  stage: StageId;
  hyper: boolean;
}
