import { ENEMY_AIR, STAGGER } from "../../constants/combat";
import { SPARKS } from "../../constants/palette";
import { GROUND, W } from "../../constants/stage";
import { sfx } from "../../services/audio";
import type { Enemy } from "../../types/enemy";
import { clamp } from "../../utils/math";
import { createImpact } from "../effects/impact";
import { game } from "../state";
import { enemyCenter } from "./enemy";
import { kindOf } from "./kinds";

/** too many staggers in a row: the foe sets itself and cannot be staggered for a while, so no string holds it forever */
function brace(e: Enemy): void {
  Object.assign(e, { brace: STAGGER.brace, stagger: 0, staggerHits: 0 });
  const [cx, cy] = enemyCenter(e);
  game.fx.push(createImpact(cx, cy, e.face, false, SPARKS.hot));
  sfx.block();
}

/**
 * Stagger a minion for `seconds`: whatever it was doing is cut, and it cannot act until the stagger ends. A foe in the
 * air or knocked down is already out of the fight, so only the timer is kept. Mini bosses and bosses never stagger.
 */
export function staggerFoe(e: Enemy, seconds: number): void {
  if (seconds <= 0 || e.rank !== "minion" || e.brace > 0 || e.stopped > 0) return;
  if (e.stagger <= 0 && e.staggerIdle > STAGGER.forget) e.staggerHits = 0;
  e.staggerHits++;
  e.staggerIdle = 0;
  if (e.staggerHits > (e.elite ? STAGGER.eliteLimit : STAGGER.limit)) {
    brace(e);
    return;
  }
  if (e.stagger <= 0 && !e.air && e.stun <= 0) {
    Object.assign(e, { state: kindOf(e.type).rest, st: 0 });
    if (!kindOf(e.type).flies && e.y >= GROUND) e.vy = 0;
  }
  e.stagger = Math.max(e.stagger, seconds);
}

/** count a stagger down; true while it holds the foe: it slides to a stop, and a walker caught off the floor drops to it */
export function updateStagger(e: Enemy, dt: number): boolean {
  e.brace = Math.max(0, e.brace - dt);
  if (e.stagger <= 0) {
    e.staggerIdle += dt;
    return false;
  }
  e.stagger -= dt;
  // thrown up or knocked down, the foe is out of the string: the count of blows starts again
  if (e.air || e.stun > 0) {
    e.staggerHits = 0;
    return false;
  }
  e.vx -= e.vx * STAGGER.friction * dt;
  e.x = clamp(e.x + e.vx * dt, 10, W - 10);
  if (kindOf(e.type).flies) e.vy -= e.vy * STAGGER.friction * dt;
  else e.vy = e.y < GROUND ? e.vy + ENEMY_AIR.gravity * dt : 0;
  e.y += e.vy * dt;
  if (!kindOf(e.type).flies) e.y = Math.min(e.y, GROUND);
  if (e.stagger <= 0) e.cd = Math.max(e.cd, STAGGER.rest);
  return true;
}
