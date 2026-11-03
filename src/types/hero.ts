import type { Projectile } from "./effect";
import type { Enemy } from "./enemy";
import type { MoveId } from "./move";
import type { Pose } from "./pose";
import type { Point } from "./world";

export type ClipName =
  | "atk1"
  | "atk2"
  | "atk3"
  | "thrust"
  | "sweep"
  | "uppercut"
  | "spin"
  | "plunge"
  | "flip"
  | "twinFang"
  | "hopCleave"
  | "crescent"
  | "pivot"
  | "ring"
  | "downStab"
  | "chase"
  | "airCross"
  | "airFlip"
  | "airDrill"
  | "airHammer"
  | "dashCut"
  | "phase"
  | "skyRend"
  | "cast"
  | "throw"
  | "warpStrike";
export type HeroState =
  | "move"
  | "cast"
  | "throw"
  | "warpStrike"
  | "charge"
  | "ultimate"
  | "idle"
  | "walk"
  | "run"
  | "jump"
  | "fall"
  | "throwWait"
  | "dash"
  | "hurt"
  | "dead"
  | "hang";

/** Where a warp goes: an enemy, a floating crystal, or a point in the air. */
export interface WarpTarget {
  x: number;
  y: number;
  enemy?: Enemy;
  anchor?: Point;
}

/** A verlet rope point. */
export interface RopePoint {
  x: number;
  y: number;
  px: number;
  py: number;
}

export interface Hero {
  x: number;
  y: number;
  vx: number;
  vy: number;
  face: number;
  ground: boolean;
  state: HeroState;
  st: number;
  runPhase: number;
  /** a double tap toward a side starts running until that side is let go */
  running: boolean;
  hp: number;
  mp: number;
  inv: number;
  jumps: number;
  drop: number;
  anchor: Point | null;
  hasSword: boolean;
  hitDone: boolean;
  cutShort: boolean;
  /** the highest point Kael may rise to before he lands again, set by his last jump or a lift from the floor */
  liftTop: number;
  pose: Pose;
  /** where the near hand ended up in the last drawn frame, local pixels */
  hand: [number, number];
  ghostTimer: number;
  sword: Projectile | null;
  warpTarget: WarpTarget | null;
  /** the combo move being played */
  move: MoveId | null;
  /** the combo move started last */
  lastMove: MoveId | null;
  /** hits of the current move already dealt */
  hitIndex: number;
  /** moves in the current combo */
  chain: number;
  /** the next move, picked when the attack key was pressed */
  queued: MoveId | null;
  /** time left to continue the combo after a move ends */
  link: number;
  /** pause after a finished combo */
  comboCd: number;
  /** air attacks since leaving the ground */
  airHits: number;
  whirled: boolean;
  /** spent by dashes; the maximum is progress.stats.stamina */
  stamina: number;
  /** seconds left before stamina starts coming back */
  staminaWait: number;
  /** seconds left of the bar's flash after a dash it could not pay for */
  staminaFlash: number;
  airDashed: boolean;
  /** seconds since the last dash ended */
  sinceDash: number;
  warpCd: number;
  /** the spell is cast at once and stronger: J J I */
  spellPower: number;
  lastHit: Enemy | null;
  /** seconds the ultimate key has been held */
  charge: number;
  chargeLevel: number;
  /** foes the current move has struck; a move that hits nothing cannot be cancelled early */
  moveHits: number;
  /** this dash already earned a perfect dodge */
  perfectUsed: boolean;
  /** Riposte: time left in which the next sword hit is tripled */
  riposte: number;
  /** a downward stab was used in this combo */
  stabbed: boolean;
  /** Keen timing: time left in which a J press makes the next move a sure crit */
  keenOpen: number;
  /** J was pressed before the current blow landed, so this move cannot open Keen timing */
  keenSpoiled: boolean;
  /** the queued move was pressed with Keen timing */
  keenNext: boolean;
  /** the current move's blows are sure crits */
  keen: boolean;
  /** seconds until the next afterimage of the current move */
  moveGhost: number;
}
