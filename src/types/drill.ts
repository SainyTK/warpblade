import type { SlashShape } from "./effect";
import type { Enemy } from "./enemy";
import type { InputAction } from "./input";
import type { Pose } from "./pose";
import type { Vec } from "./rig";
import type { Platform } from "./world";

export type Side = -1 | 1;
export type Direction = Side | 0;
export type DrillStrikeId = "first" | "second" | "third" | "air";
export type FollowUp = "warp" | "enhancedParry";

export interface DrillStrikePoses {
  ready: Pose;
  load: Pose;
  cut: Pose;
  finish: Pose;
  settle: number;
}

export interface DrillStrike {
  hit: number;
  duration: number;
  reach: number;
  height: number;
  step: number;
  next: DrillStrikeId | null;
  damage: number;
  finisher: boolean;
  poses: DrillStrikePoses;
  arc: Omit<SlashShape, "R">;
}

export type DrillSpellLook = "flame" | "shard" | "spark";
export type DrillTierLook = "crescent" | "spires" | "rift" | "nova";

export interface DrillSpell {
  id: string;
  name: string;
  color: number;
  core: number;
  damage: number;
  radius: number;
  range: number;
  speed: number | null;
  delay: number;
  look: DrillSpellLook;
  freeze: number;
  status?(foe: Enemy): void;
  drawBolt?(bolt: ElementProjectile): void;
  drawImpact?(impact: ElementImpact): void;
}

export interface DrillTier {
  level: 1 | 2 | 3 | 4;
  name: string;
  threshold: number;
  damage: number;
  reach: number;
  height: number;
  intro: number;
  duration: number;
  color: number;
  look: DrillTierLook;
  around: boolean;
  windup?: Pose;
  cut?: Pose;
  drawStrike?(cast: SkillCast, progress: number, fade: number): void;
}

export interface DrillMotion {
  run: number;
  groundAccel: number;
  groundBrake: number;
  airAccel: number;
  airBrake: number;
  riseGravity: number;
  fallGravity: number;
  rise: number;
  release: number;
  fall: number;
  dash: number;
  dashBurst: number;
  dashTime: number;
  dashRecovery: number;
  dashJump: number;
  wallSlide: number;
  wallKick: number;
  wallLock: number;
  jumpGrace: number;
  buffer: number;
  landing: number;
}

export interface DrillPoses {
  stance: Pose;
  breathe: Pose;
  run(phase: number): Pose;
  brake: Pose;
  low: Pose;
  touchdown: Pose;
  dash: Pose;
  airDash: Pose;
  rise: Pose;
  leap: Pose;
  kick: Pose;
  fall: Pose;
  wall: Pose;
  guard: Pose;
  airGuard: Pose;
  stagger: Pose;
  parryContact: Pose;
  parryReturn: Pose;
  spell: Pose;
  skillWindup: Pose;
  skillCut: Pose;
  warpThrow(age: number): Pose;
  warpFlight(age: number): Pose;
  warpArrival(age: number): Pose;
}

export interface DrillModifiers {
  strikeDamage: number;
  finisherDamage: number;
  strikeReach: number;
  spellDamage: number;
  spellArea: number;
  preparation: number;
  infusionHits: number;
  warpDamage: number;
  warpCooldown: number;
  tierDamage: number;
  tierReach: number;
  chargeRate: number;
  airDashes: number;
  airSlashes: number;
  parryWindow: number;
}

export interface SkillCast {
  tier: DrillTier;
  age: number;
  x: number;
  y: number;
  face: Side;
}

export interface DrillHooks {
  spellHit?(foe: Enemy, spell: DrillSpell): void;
  dashed?(foes: readonly Enemy[]): void;
  swordHit?(foe: Enemy, infusion: DrillSpell | null): void;
  slashed?(strike: DrillStrikeId | "warp", landed: boolean): void;
  released?(cast: SkillCast): void;
  tick?(dt: number): void;
  draw?(): void;
  drawBack?(): void;
  reset?(): void;
}

export interface DrillProfile {
  strikes: Readonly<Record<DrillStrikeId, DrillStrike>>;
  attack: number;
  spells: readonly DrillSpell[];
  known(): readonly DrillSpell[];
  tiers: readonly [DrillTier, DrillTier, DrillTier, DrillTier];
  warpSlash: SlashShape;
  enhancedParry: number;
  drawThrown(x: number, y: number, angle: number): void;
  portrait: string | (() => Promise<string | undefined>);
  drawCutIn?(ctx: CanvasRenderingContext2D, cast: SkillCast, portrait: HTMLImageElement): void;
  text: Readonly<Partial<Record<InputAction, string>>>;
  modifiers(): DrillModifiers;
  motion?: Partial<DrillMotion>;
  poses?: Partial<DrillPoses>;
  hooks?: DrillHooks;
}

export interface DrillInput {
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
  kind: DrillStrikeId;
  age: number;
  chain: boolean;
  followUp: FollowUp | null;
}

export interface SpellRelease {
  life: number;
}

export interface SpellPreparation {
  remaining: number;
  duration: number;
  readyAge: number;
}

export interface SpellBook {
  selected: DrillSpell;
  preparation: SpellPreparation | null;
  selectionCue: number;
}

export interface SwordInfusion {
  spell: DrillSpell;
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
  airDashes: number;
  dashTime: number;
  dashReadyIn: number;
  airDashActive: boolean;
  airSlashes: number;
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
  kind: DrillStrikeId | "warp";
  element: DrillSpell | null;
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
  spell: DrillSpell;
  x: number;
  y: number;
  face: Side;
  distance: number;
}

export interface ElementImpact {
  spell: DrillSpell;
  x: number;
  y: number;
  face: Side;
  age: number;
  fromSword: boolean;
}

export interface Session {
  profile: DrillProfile;
  motion: DrillMotion;
  modifiers: DrillModifiers;
  fighter: Fighter;
  warpTrace: WarpTrace | null;
  elementProjectiles: ElementProjectile[];
  elementImpacts: ElementImpact[];
  releasedStrike: ReleasedStrike | null;
  defenseCue: DefenseCue | null;
}
