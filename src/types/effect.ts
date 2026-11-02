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
