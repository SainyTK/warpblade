import { ENEMY_AIR, JUGGLE_LIMIT } from "../../constants/combat";
import { ENEMIES } from "../../constants/enemies";
import { GROUND, W } from "../../constants/stage";
import type { Enemy } from "../../types/enemy";
import { clamp } from "../../utils/math";
import { dust, shake } from "../world";
import { kindOf } from "./kinds";

/** throw a foe into the air, where it tumbles and takes double damage until it lands */
export function launchEnemy(e: Enemy, vy: number): void {
  if (!ENEMIES[e.type].launchable) return;
  // a foe already in the air rises less each time it is thrown up again
  const lift = e.air ? Math.max(0.3, 1 - e.airHits / JUGGLE_LIMIT) : 1;
  if (e.air) e.airHits++;
  Object.assign(e, { air: true, airTime: 0, vy: vy * lift, state: "recover", st: 0 });
}

/** an airborne foe falls, bounces once if it was spiked, then lies stunned; returns false once it is down */
export function updateAirborne(e: Enemy, dt: number): boolean {
  if (!e.air) return false;
  e.airTime += dt;
  const flies = kindOf(e.type).flies;
  e.vy += ENEMY_AIR.gravity * dt * (flies ? 0.8 : 1);
  e.vx -= e.vx * 1.5 * dt;
  e.x = clamp(e.x + e.vx * dt, 10, W - 10);
  e.y += e.vy * dt;
  if (e.y < 14) {
    e.y = 14;
    e.vy = Math.max(e.vy, 0);
  }
  const floor = flies ? GROUND - 8 : GROUND;
  if (e.y >= floor && e.vy > 0) {
    e.y = floor;
    if (e.vy > ENEMY_AIR.spike * 0.75) {
      e.vy = ENEMY_AIR.bounce;
      dust(e.x, GROUND, 6);
      shake(0.12, 2);
      return true;
    }
    Object.assign(e, { air: false, vy: 0, airHits: 0, stun: Math.max(e.stun, ENEMY_AIR.landStun) });
    dust(e.x, GROUND, 3);
    return false;
  }
  if (flies && e.airTime > ENEMY_AIR.wispRecover && e.vy > 0) {
    e.air = false;
    e.airHits = 0;
  }
  return true;
}
