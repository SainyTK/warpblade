import { FLINCH } from "../../constants/combat";
import type { Enemy } from "../../types/enemy";
import { actOnFoe, stageFoePace } from "../adventure";
import { bossHeld } from "../bossFight";
import { coop } from "../coopHooks";
import { game, hero } from "../state";
import { fieldPace } from "../timeFields";
import { updateAirborne } from "./airborne";
import { enemyCenter } from "./enemy";
import { kindOf } from "./kinds";
import { separateFoes } from "./separate";
import { updateStagger } from "./stagger";
import { updateStatus } from "./status";

function attackPace(e: Enemy): number {
  if (e.armored) return 1;
  const [cx, cy] = enemyCenter(e);
  const near = Math.abs(hero.x - cx) <= FLINCH.reach && Math.abs(hero.y - cy) <= FLINCH.lift;
  return near ? FLINCH.cooldownPace : 0;
}

/** a tripped or landed foe lies still and slides to a stop */
function updateStunned(e: Enemy, dt: number): boolean {
  if (e.stun <= 0) return false;
  if (kindOf(e.type).steady?.(e)) {
    e.stun = 0;
    return false;
  }
  e.stun -= dt;
  e.vx -= e.vx * 5 * dt;
  e.x += e.vx * dt;
  if (e.stun <= 0) Object.assign(e, { state: kindOf(e.type).rest, st: 0, cd: 0.4 });
  return true;
}

function updateEnemy(e: Enemy, dt: number): void {
  const room = coop();
  room?.nearest(e.x, e.y);
  const status = updateStatus(e, dt);
  if (e.hp <= 0 || bossHeld(e)) return;
  room?.nearest(e.x, e.y);
  const [cx, cy] = enemyCenter(e);
  const ts = status * fieldPace(cx, cy, e.rank) * stageFoePace();
  const sdt = dt * ts;
  const staggered = updateStagger(e, sdt);
  if (updateAirborne(e, sdt) || updateStunned(e, sdt) || staggered) return;
  e.st += sdt;
  const heldAt = e.x;
  actOnFoe(e, () => {
    e.cd -= sdt * attackPace(e);
    kindOf(e.type).update(e, sdt, ts);
  });
  if (e.pinned > 0) {
    e.x = heldAt;
    e.vx = 0;
  }
}

export function updateEnemies(dt: number): void {
  for (const e of game.enemies) updateEnemy(e, dt);
  game.enemies = game.enemies.filter((e) => e.hp > 0);
  separateFoes(dt);
}
