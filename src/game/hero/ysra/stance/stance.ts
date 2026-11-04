import { jump } from "../../jump";
import type { YsraPart } from "../part";

/** Up: Ysra's jump. Placeholder: Kael's. */
export function pressJump(): boolean {
  return jump();
}
/** K: the pole vault on the floor, the dive in the air. Placeholder: does nothing. */
export function pressVault(): boolean {
  return true;
}
/** L: brace, parry, or a backstep with a side held away. Placeholder: does nothing. */
export function pressGuard(_dir: number): boolean {
  return true;
}
/** a double tap toward a side. Placeholder: does nothing. */
export function doubleTapStance(_dir: number): void {}
/** a parry opened a counter: the next J is the counter thrust */
export function counterReady(): boolean {
  return false;
}
export function spendCounter(): void {}

export const STANCE_PART: YsraPart = {};
