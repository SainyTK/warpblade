import type { Enemy } from "../../types/enemy";
import { coop } from "../coopHooks";
import { game } from "../state";
import { updateAirborne } from "./airborne";
import { kindOf } from "./kinds";
import { separateFoes } from "./separate";
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
  const room = coop();
  for (const e of game.enemies) {
    room?.nearest(e.x, e.y);
    const ts = updateStatus(e, dt);
    if (e.hp <= 0) continue;
    // a burn tick acts for the hero who lit the foe; the foe itself goes for the nearest
    room?.nearest(e.x, e.y);
    const sdt = dt * ts;
    if (updateAirborne(e, sdt) || updateStunned(e, sdt)) continue;
    e.st += sdt;
    e.cd -= sdt;
    kindOf(e.type).update(e, sdt, ts);
  }
  game.enemies = game.enemies.filter((e) => e.hp > 0);
  separateFoes(dt);
}
