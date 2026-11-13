import { HOLD_ACTIONS, HOLD_STEPS, INPUT_BUFFER_STEPS, KEPT_DURING_MOVE } from "../constants/input";
import type { HeldAction, InputAction } from "../types/input";
import { rememberPerSeat } from "./seatMemory";

/**
 * Which actions are held, and which were pressed recently: a press stays usable for a few steps until something uses it.
 *
 * J and I tell a tap from a long press. Their key going down queues nothing: letting go before `HOLD_STEPS` queues the
 * tap (`attack`, `cast`), and holding on to `HOLD_STEPS` queues the long press (`warp`, `castWide`) at once, with no tap
 * after it. So a long press never also plays the tap's move.
 */
const held = new Set<InputAction>();
const pressed = new Map<InputAction, number>();
/** simulation steps each tap-or-hold key has been down and still undecided; gone once it is decided */
const holding = new Map<HeldAction, number>();
/** told of every press and release; a co-op guest sends them to the host */
let watcher: ((action: InputAction, down: boolean) => void) | null = null;

rememberPerSeat({
  hostOnly: true,
  save: () => ({ held: new Set(held), pressed: new Map(pressed), holding: new Map(holding) }),
  load(saved) {
    const from = saved as {
      held: Set<InputAction>;
      pressed: Map<InputAction, number>;
      holding: Map<HeldAction, number>;
    };
    held.clear();
    pressed.clear();
    holding.clear();
    for (const a of from.held) held.add(a);
    for (const [a, age] of from.pressed) pressed.set(a, age);
    for (const [a, steps] of from.holding) holding.set(a, steps);
  },
});

const isHoldAction = (a: InputAction): a is HeldAction => a in HOLD_ACTIONS;

export function watchInput(listener: ((action: InputAction, down: boolean) => void) | null): void {
  watcher = listener;
}

export function press(a: InputAction): void {
  if (!held.has(a)) {
    if (isHoldAction(a)) holding.set(a, 0);
    else pressed.set(a, 0);
  }
  held.add(a);
  watcher?.(a, true);
}
export function release(a: InputAction): void {
  // let go before the long press was reached: it was a tap
  if (isHoldAction(a) && holding.has(a)) {
    holding.delete(a);
    pressed.set(a, 0);
  }
  held.delete(a);
  watcher?.(a, false);
}
export function releaseAll(): void {
  if (watcher) for (const a of held) watcher(a, false);
  held.clear();
  holding.clear();
}
/** forget every unused press, so keys hit in a menu do nothing in the game */
export function clearPresses(): void {
  pressed.clear();
  holding.clear();
}
/**
 * Called once per simulation step: unused presses expire after the buffer, except the kept ones while a move plays, and a
 * tap-or-hold key held long enough becomes its long press.
 */
export function agePresses(moving: boolean): void {
  for (const [a, age] of pressed) {
    const kept = moving && KEPT_DURING_MOVE.includes(a);
    if (age >= INPUT_BUFFER_STEPS && !kept) pressed.delete(a);
    else pressed.set(a, age + 1);
  }
  for (const [a, steps] of holding) {
    if (steps + 1 < HOLD_STEPS) {
      holding.set(a, steps + 1);
      continue;
    }
    holding.delete(a);
    pressed.set(HOLD_ACTIONS[a], 0);
  }
}
export const isHeld = (a: InputAction): boolean => held.has(a);
/** simulation steps since a waiting press, or -1 when none waits */
export const pressAge = (a: InputAction): number => pressed.get(a) ?? -1;
/** how far a tap-or-hold key is toward its long press, 0 to 1; 0 when it is up or already decided */
export const holdShare = (a: HeldAction): number => (holding.get(a) ?? 0) / HOLD_STEPS;
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
