import type { Enemy } from "../../types/enemy";
import type { Vec } from "../../types/rig";
import type { Platform } from "../../types/world";
import type { SkillTier } from "../skillTiers";
import type { SpellKind, TravelingSpell } from "../spells";

export type Side = -1 | 1;
export type Direction = Side | 0;
export type Strike = "first" | "second" | "third" | "air";
export type FollowUp = "warp" | "enhancedParry";

export interface TrainingInput {
  dir: Direction;
  jumpHeld: boolean;
  jump: boolean;
  dash: boolean;
  attack: boolean;
  attackHeld: boolean;
  cast: boolean;
  cycle: boolean;
  guardHeld: boolean;
  guard: boolean;
  drop: boolean;
}

export interface Swing {
  kind: Strike;
  age: number;
  chain: boolean;
  followUp: FollowUp | null;
}

export interface SpellRelease {
  life: number;
}

export interface SkillCast {
  tier: SkillTier;
  age: number;
  x: number;
  y: number;
  face: Side;
}

export interface SpellPreparation {
  remaining: number;
  duration: number;
  readyAge: number;
}

export interface SpellBook {
  selected: SpellKind;
  preparation: SpellPreparation | null;
  preparationSeconds: number;
  selectionCue: number;
}

export interface SwordInfusion {
  kind: SpellKind;
  remainingHits: number;
  age: number;
}

export interface Fighter {
  x: number;
  y: number;
  vx: number;
  vy: number;
  face: Side;
  grounded: boolean;
  wall: Direction;
  droppedPlatform: Platform | null;
  wallLock: number;
  grace: number;
  jumpBoost: boolean;
  airDash: boolean;
  dashTime: number;
  dashReadyIn: number;
  airDashActive: boolean;
  airSlashUsed: boolean;
  warpReadyIn: number;
  warp: ActiveWarp | null;
  jumpBuffer: number;
  dashBuffer: number;
  attackBuffer: number;
  swing: Swing | null;
  guardAge: number | null;
  parryAge: number | null;
  enhancedGuard: number;
  spellRelease: SpellRelease | null;
  chargeHeldFor: number | null;
  skillCast: SkillCast | null;
  spellBook: SpellBook;
  swordInfusion: SwordInfusion | null;
  stun: number;
}

export interface DefenseCue {
  kind: "block" | "parry" | "enhancedParry" | "hit";
  x: number;
  y: number;
  life: number;
}

export type ReleasedStrike = Pick<Fighter, "x" | "y" | "face"> & {
  kind: Strike | "warp";
  element: SpellKind | null;
  landed: boolean;
};

export interface WarpTarget {
  enemy: Enemy | null;
  x: number;
  y: number;
}

export interface WarpWeapon {
  x: number;
  y: number;
  angle: number;
  trail: Vec[];
}

export type ActiveWarp =
  | { phase: "throw"; age: number; target: WarpTarget }
  | { phase: "flight"; age: number; target: WarpTarget; weapon: WarpWeapon }
  | { phase: "arrival"; age: number };

export interface WarpTrace {
  from: Vec;
  to: Vec;
  face: Side;
  life: number;
}

export interface ElementProjectile {
  kind: TravelingSpell;
  x: number;
  y: number;
  face: Side;
  distance: number;
}

export interface ElementImpact {
  kind: SpellKind;
  x: number;
  y: number;
  face: Side;
  age: number;
  fromSword: boolean;
}

export interface Session {
  fighter: Fighter;
  warpTrace: WarpTrace | null;
  elementProjectiles: ElementProjectile[];
  elementImpacts: ElementImpact[];
  releasedStrike: ReleasedStrike | null;
  defenseCue: DefenseCue | null;
}
