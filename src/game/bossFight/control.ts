import { CONTROL_RESIST } from "../../constants/bossFight";
import type { Enemy } from "../../types/enemy";

const HELD = ["stun", "frozen", "halt", "pinned"] as const;

type Held = (typeof HELD)[number];

export type ControlMemory = Record<Held, number> & { count: number; since: number };

export const forgetControl = (): ControlMemory => ({ stun: 0, frozen: 0, halt: 0, pinned: 0, count: 0, since: 0 });

export function resistControl(memory: ControlMemory, e: Enemy, dt: number): void {
  memory.since += dt;
  if (memory.count > 0 && memory.since > CONTROL_RESIST.forget) {
    memory.count--;
    memory.since = 0;
  }
  let held = false;
  for (const key of HELD) {
    const added = e[key] - memory[key];
    if (added > dt) {
      e[key] = memory[key] + added * CONTROL_RESIST.keep ** memory.count;
      held = true;
    }
    memory[key] = e[key];
  }
  if (!held) return;
  memory.count++;
  memory.since = 0;
}
