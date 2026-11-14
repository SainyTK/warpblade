import type { Projectile } from "./effect";
import type { Enemy } from "./enemy";
import type { Pose } from "./pose";

/** why a press was refused: the selected spell or the warp is still recharging, or MP is short */
export type DenyReason = "cast" | "warp" | "mp" | "ult";

/** the states the shared loop runs for every hero */
export type SharedHeroState =
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
  /** K held: the guard every hero shares */
  | "guard";

/**
 * The states each kit runs itself (`HeroKit.runState`), by hero id. A hero adds its own names from its own types file,
 * without editing this one:
 *
 *   declare module "../../../types/hero" { interface KitStates { cerise: "lunge" | "riposte" } }
 */
export interface KitStates {}

export type HeroState = SharedHeroState | KitStates[keyof KitStates];
/** the shared states posed by their own keyed clip; the rest play an action clip */
export type StateClipName = Exclude<SharedHeroState, "move" | "cast" | "throw" | "warpStrike">;

/** Where a warp goes: an enemy, a floating crystal, or a point in the air. */
export interface WarpTarget {
  x: number;
  y: number;
  enemy?: Enemy;
  /** a ranged hero's throw away from a foe: the foe they strike once they land */
  aim?: Enemy;
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
  hasSword: boolean;
  hitDone: boolean;
  /** the highest point the hero may rise to before landing again, set by his last jump or a lift from the floor */
  liftTop: number;
  pose: Pose;
  /** where the near hand ended up in the last drawn frame, local pixels */
  hand: [number, number];
  ghostTimer: number;
  sword: Projectile | null;
  warpTarget: WarpTarget | null;
  /** the combo move being played */
  move: string | null;
  /** the combo move started last */
  lastMove: string | null;
  /** hits of the current move already dealt */
  hitIndex: number;
  /** moves in the current combo */
  chain: number;
  /** the next move, picked when the attack key was pressed */
  queued: string | null;
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
  warpCd: number;
  /** seconds before the ultimate can be charged again */
  ultCd: number;
  /** the full length of the ultimate's current wait, for the recharge display: an ultimate skill may set its own */
  ultFull: number;
  /** seconds left of the HUD flash after a refused press: a spell or the warp still recharging, or MP short */
  denied: Record<DenyReason, number>;
  lastHit: Enemy | null;
  /** seconds the ultimate key has been held */
  charge: number;
  chargeLevel: number;
  /** foes the current move has struck; a move that hits nothing cannot be cancelled early */
  moveHits: number;
  /** the hero's own hits in a row for the hit counter, and seconds since the last one */
  hitCount: number;
  hitIdle: number;
  /** this dash already earned a perfect dodge */
  perfectUsed: boolean;
  /** Riposte (Mirror Knight): time left in which the next sword blows hit harder */
  riposte: number;
  /** Riposte: sword blows left that it covers */
  riposteBlows: number;
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
