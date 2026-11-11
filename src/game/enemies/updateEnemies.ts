import type { Enemy } from "../../types/enemy";
import { coop } from "../coopHooks";
import { game } from "../state";
import { fieldPace } from "../timeFields";
import { updateAirborne } from "./airborne";
import { enemyCenter } from "./enemy";
import { applyHolds } from "./holds";
import { kindOf } from "./kinds";
import { separateFoes } from "./separate";
import { updateStagger } from "./stagger";
import { updateStatus } from "./status";
import { tickStop } from "./timeStop";

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
    const status = updateStatus(e, dt);
    if (e.hp <= 0) continue;
    // a burn tick acts for the hero who lit the foe; the foe itself goes for the nearest
    room?.nearest(e.x, e.y);
    // a foe stopped in time neither moves, acts nor falls until it restarts
    if (tickStop(e, dt) || e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    const ts = status * fieldPace(cx, cy, e.rank);
    const sdt = dt * ts;
    const staggered = updateStagger(e, sdt);
    if (updateAirborne(e, sdt) || updateStunned(e, sdt) || staggered) continue;
    e.st += sdt;
    e.cd -= sdt;
    const heldAt = e.x;
    kindOf(e.type).update(e, sdt, ts);
    // a body standing in its way on the floor (a Wick) stops or slows it
    applyHolds(e, heldAt, sdt);
    // a pinned foe stays where it is held, whatever its own step asked for: no walk, charge or lunge carries it off
    if (e.pinned > 0) {
      e.x = heldAt;
      e.vx = 0;
    }
  }
  game.enemies = game.enemies.filter((e) => e.hp > 0);
  separateFoes(dt);
}
