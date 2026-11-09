import type { Enemy } from "../../types/enemy";

/**
 * Something on the floor that stands in a walking foe's way, such as Wenna's Wicks. After each foe's own step the game
 * asks every hold whether it stops the foe there, given where the foe stood before the step. A hold may move the foe
 * back to its edge, or be pushed itself.
 */
export type FoeHold = (e: Enemy, before: number, dt: number) => void;

const holds: FoeHold[] = [];

/** a kit adds its hold once, when its module loads */
export function addFoeHold(hold: FoeHold): void {
  holds.push(hold);
}

/** every hold has its say on a foe that has just stepped */
export function applyHolds(e: Enemy, before: number, dt: number): void {
  for (const hold of holds) hold(e, before, dt);
}
