import type { InputAction } from "../types/input";

/** Which actions are held, and which were pressed since the simulation last read them. */
const held = new Set<InputAction>();
const pressed = new Set<InputAction>();

export function press(a: InputAction): void {
  if (!held.has(a)) pressed.add(a);
  held.add(a);
}
export function release(a: InputAction): void {
  held.delete(a);
}
export function releaseAll(): void {
  held.clear();
}
export const isHeld = (a: InputAction): boolean => held.has(a);
/** true once per press */
export function take(a: InputAction): boolean {
  if (!pressed.has(a)) return false;
  pressed.delete(a);
  return true;
}
