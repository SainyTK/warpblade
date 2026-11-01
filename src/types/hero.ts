import type { Projectile } from "./effect";
import type { Enemy } from "./enemy";
import type { Pose } from "./pose";
import type { Point } from "./world";

export type ClipState = "atk1" | "atk2" | "atk3" | "cast" | "throw" | "warpStrike";
export type HeroState = ClipState | "idle" | "run" | "jump" | "fall" | "throwWait" | "dodge" | "hurt" | "dead" | "hang";

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
  combo: number;
  queued: boolean;
  hp: number;
  mp: number;
  inv: number;
  jumps: number;
  dodgeCd: number;
  drop: number;
  anchor: Point | null;
  hasSword: boolean;
  hitDone: boolean;
  cutShort: boolean;
  pose: Pose;
  /** where the near hand ended up in the last drawn frame, local pixels */
  hand: [number, number];
  ghostTimer: number;
  sword: Projectile | null;
  warpTarget: WarpTarget | null;
}
