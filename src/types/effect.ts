import type { SourceId } from "./build";
import type { Ramp } from "./color";

/** A live effect: update returns false once it has finished. drawBack draws what sits behind the characters. */
export interface Effect {
  update(dt: number): boolean;
  draw(): void;
  drawBack?(): void;
  /** an enemy spawn portal; waves wait for these */
  rift?: boolean;
}
/** The thrown sword. */
export interface Projectile {
  x: number;
  y: number;
  done: boolean;
  update(dt: number): void;
  draw(): void;
}
/** A swing on a tilted ellipse around (cx, cy), from angle a0 to a1, in local pixels facing right. */
export interface SlashShape {
  cx: number;
  cy: number;
  R: number;
  /** squash across the swing plane: 1 faces us, small values lie flat */
  sy: number;
  rot: number;
  a0: number;
  a1: number;
  /** widest band thickness */
  W: number;
  t0?: number;
  sweep?: number;
  hold?: number;
  trail?: number;
  ramp?: Ramp;
}
/** One fire burst: foes inside the radius take up to `damage`, less toward the edge, and burn for `burn` seconds.
 *  `brands` burning chunks fly off and set the floor alight. Smaller bursts shake and stop the game less. */
export interface Blast {
  radius: number;
  damage: number;
  burn: number;
  brands?: number;
  shake?: number;
  amp?: number;
  hitStop?: number;
  /** what threw it, for the end of run screen */
  source: SourceId;
}
/** a thrown flask in flight */
export interface Flask {
  x: number;
  y: number;
  vx: number;
  vy: number;
  t: number;
}
