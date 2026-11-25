import type { EraId } from "../constants/eras";
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

export type GateRoom =
  | { kind: "boss"; foe: EnemyType }
  | { kind: "surge"; count: number; cap: number; foes?: readonly EnemyType[] };

export interface Approach {
  rise: number;
  room: GateRoom;
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
  grantsArt?: ArtId;
  weakTo?: ArtId;
  areas: readonly [Approach, ...Approach[]];
  hazard?: StageHazard;
}
