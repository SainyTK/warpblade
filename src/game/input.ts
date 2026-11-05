import { INPUT_BUFFER_STEPS, KEPT_DURING_MOVE } from "../constants/input";
import type { InputAction } from "../types/input";
import { rememberPerSeat } from "./seatMemory";

/** Which actions are held, and which were pressed recently: a press stays usable for a few steps until something uses it. */
const held = new Set<InputAction>();
const pressed = new Map<InputAction, number>();
/** told of every press and release; a co-op guest sends them to the host */
let watcher: ((action: InputAction, down: boolean) => void) | null = null;

rememberPerSeat({
  hostOnly: true,
  save: () => ({ held: new Set(held), pressed: new Map(pressed) }),
  load(saved) {
    const from = saved as { held: Set<InputAction>; pressed: Map<InputAction, number> };
    held.clear();
    pressed.clear();
    for (const a of from.held) held.add(a);
    for (const [a, age] of from.pressed) pressed.set(a, age);
  },
});

export function watchInput(listener: ((action: InputAction, down: boolean) => void) | null): void {
  watcher = listener;
}

export function press(a: InputAction): void {
  if (!held.has(a)) pressed.set(a, 0);
  held.add(a);
  watcher?.(a, true);
}
export function release(a: InputAction): void {
  held.delete(a);
  watcher?.(a, false);
}
export function releaseAll(): void {
  if (watcher) for (const a of held) watcher(a, false);
  held.clear();
}
/** forget every unused press, so keys hit in a menu do nothing in the game */
export function clearPresses(): void {
  pressed.clear();
}
/** called once per simulation step: unused presses expire after the buffer, except the kept ones while a move plays */
export function agePresses(moving: boolean): void {
  for (const [a, age] of pressed) {
    const kept = moving && KEPT_DURING_MOVE.includes(a);
    if (age >= INPUT_BUFFER_STEPS && !kept) pressed.delete(a);
    else pressed.set(a, age + 1);
  }
}
export const isHeld = (a: InputAction): boolean => held.has(a);
/** simulation steps since a waiting press, or -1 when none waits */
export const pressAge = (a: InputAction): number => pressed.get(a) ?? -1;
/** true once per press */
export function take(a: InputAction): boolean {
  if (!pressed.has(a)) return false;
  pressed.delete(a);
  return true;
}
/** use a waiting press only if the action it asks for happens */
export function use(a: InputAction, act: () => boolean): void {
  if (pressed.has(a) && act()) pressed.delete(a);
}
