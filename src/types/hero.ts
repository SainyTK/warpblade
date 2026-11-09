import type { Projectile } from "./effect";
import type { Enemy } from "./enemy";
import type { HuldaState } from "./hulda";
import type { MirelState } from "./mirel";
import type { MoveId } from "./move";
import type { OrrinState } from "./orrin";
import type { Pose } from "./pose";
import type { SableState } from "./sable";
import type { KaelAbility } from "./spell";
import type { Point } from "./world";
import type { YsraClipName, YsraState } from "./ysra";

/** why a press was refused: the selected spell or the warp is still recharging, or MP is short */
export type DenyReason = "cast" | "warp" | "mp" | "ult";

/** Kael's action clips */
export type KaelClipName =
  | "atk1"
  | "atk2"
  | "atk3"
  | "sweep"
  | "spin"
  | "plunge"
  | "twinFang"
  | "hopCleave"
  | "crescent"
  | "pivot"
  | "ring"
  | "downStab"
  | "chase"
  | "airWheel"
  | "airScissor"
  | "airStomp"
  | "phase"
  | "skyRend"
  | "cast"
  | "throw"
  | "warpStrike";
export type ClipName = KaelClipName | YsraClipName;
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
  | "hang"
  | YsraState
  | SableState
  | HuldaState
  | OrrinState
  | MirelState;
/** the states posed by their own keyed clip; the rest play an action clip */
export type StateClipName = Exclude<
  HeroState,
  "move" | "cast" | "throw" | "warpStrike" | YsraState | SableState | HuldaState | OrrinState | MirelState
>;

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
  /** seconds before the ultimate can be charged again */
  ultCd: number;
  /** the full length of the ultimate's current wait, for the recharge display: an ultimate skill may set its own */
  ultFull: number;
  /** seconds before each of Kael's abilities can be cast again */
  spellCd: Record<KaelAbility, number>;
  /** the full length of each element's current wait, for the recharge display */
  spellCdFull: Record<KaelAbility, number>;
  /** the ability of the cast under way, fixed when the cast starts */
  castAbility: KaelAbility;
  /** seconds left of the HUD flash after a refused press: a spell or the warp still recharging, or MP short */
  denied: Record<DenyReason, number>;
  /** the spell is cast at once and stronger: Spellblade, I during a combo */
  spellPower: number;
  lastHit: Enemy | null;
  /** seconds the ultimate key has been held */
  charge: number;
  chargeLevel: number;
  /** foes the current move has struck; a move that hits nothing cannot be cancelled early */
  moveHits: number;
  /** this dash already earned a perfect dodge */
  perfectUsed: boolean;
  /** Riposte (Mirror Knight): time left in which the next sword blows hit harder */
  riposte: number;
  /** Riposte: sword blows left that it covers */
  riposteBlows: number;
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
  /** the swing this hero's blows belong to, so one swing hits a foe once; another hero's swing has its own */
  swing: number;
}
