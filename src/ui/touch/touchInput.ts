import { press, release } from "../../game/input";
import type { InputAction } from "../../types/input";

/** Touch sources sharing one action, such as Up from the stick and from the Jump button: held while any source holds it. */
const holders = new Map<InputAction, Set<string>>();

export function hold(source: string, action: InputAction): void {
  const set = holders.get(action) ?? new Set<string>();
  if (set.size === 0) press(action);
  set.add(source);
  holders.set(action, set);
}

export function drop(source: string, action: InputAction): void {
  const set = holders.get(action);
  if (!set?.delete(source)) return;
  if (set.size === 0) release(action);
}

/** a press with nothing held after it, for one-shot actions such as starting a run */
export function tap(action: InputAction): void {
  press(action);
  release(action);
}

/** let go of every action held by touch */
export function dropAll(): void {
  for (const [action, set] of holders) {
    if (set.size > 0) release(action);
    set.clear();
  }
}
