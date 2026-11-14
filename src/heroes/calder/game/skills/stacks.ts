import { addStacks } from "../../../../game/enemies/skillStatus";
import type { Enemy } from "../../../../types/enemy";

/** how often a burn or bleed of Calder's ticks and how long it lasts after the last stack */
const TICK = { every: 0.5, last: 3 } as const;

/** lay `stacks` of a skill's burn or bleed on a foe: `damage` a tick per stack, at most `max` */
export function layStacks(e: Enemy, source: string, stacks: number, damage: number, max: number): void {
  addStacks(e, source, { stacks, max, damage, every: TICK.every, duration: TICK.last });
}
