import type { Enemy } from "../../types/enemy";
import { game } from "../state";
import { updateAirborne } from "./airborne";
import { kindOf } from "./kinds";
import { updateStatus } from "./status";

/** a tripped or landed foe lies still and slides to a stop */
function updateStunned(e: Enemy, dt: number): boolean {
  if (e.stun <= 0) return false;
  e.stun -= dt;
  e.vx -= e.vx * 5 * dt;
  e.x += e.vx * dt;
  if (e.stun <= 0) Object.assign(e, { state: kindOf(e.type).rest, st: 0, cd: 0.4 });
  return true;
}

export function updateEnemies(dt: number): void {
  for (const e of game.enemies) {
    const ts = updateStatus(e, dt);
    if (e.hp <= 0) continue;
    const sdt = dt * ts;
    if (updateAirborne(e, sdt) || updateStunned(e, sdt)) continue;
    e.st += sdt;
    e.cd -= sdt;
    kindOf(e.type).update(e, sdt, ts);
  }
  game.enemies = game.enemies.filter((e) => e.hp > 0);
}
