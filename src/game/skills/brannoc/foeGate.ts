import type { Enemy } from "../../../types/enemy";

/** seconds until each foe can be struck again by something that keeps striking (an orbit, a cloud) */
export type FoeGate = Map<Enemy, number>;

/** the waits run down, and fallen foes are forgotten */
export function tickGate(gate: FoeGate, dt: number): void {
  for (const [e, left] of gate) {
    if (e.hp <= 0 || left - dt <= 0) gate.delete(e);
    else gate.set(e, left - dt);
  }
}

/** the foe can be struck now; when it can, it waits `every` seconds before the next */
export function passGate(gate: FoeGate, e: Enemy, every: number): boolean {
  if (gate.has(e)) return false;
  gate.set(e, every);
  return true;
}
