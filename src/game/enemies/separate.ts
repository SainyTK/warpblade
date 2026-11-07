import { SEPARATION as S } from "../../constants/enemies";
import { W } from "../../constants/stage";
import type { Enemy } from "../../types/enemy";
import { clamp } from "../../utils/math";
import { game } from "../state";
import { kindOf } from "./kinds";

/** a minion free to be nudged: resting, winding up or recovering, on its feet or wings, not held by any status */
const nudgeable = (e: Enemy): boolean =>
  e.rank === "minion" &&
  e.hp > 0 &&
  (e.state === kindOf(e.type).rest || e.state === "wind" || e.state === "recover") &&
  !e.air &&
  e.stun <= 0 &&
  e.pinned <= 0 &&
  e.frozen <= 0;

/**
 * Minions standing their ground that crowd one spot ease apart, walkers along the floor and flyers in the air, so a crowd stays
 * readable as single foes. Sorted by x, each one only meets the few close enough to touch.
 */
export function separateFoes(dt: number): void {
  const free = game.enemies.filter(nudgeable).sort((a, b) => a.x - b.x);
  for (let i = 0; i < free.length; i++) {
    const a = free[i];
    const flies = kindOf(a.type).flies;
    for (let j = i + 1; j < free.length && free[j].x - a.x < S.gap; j++) {
      const b = free[j];
      if (kindOf(b.type).flies !== flies) continue;
      const dx = b.x - a.x;
      const dy = flies ? b.y - a.y : 0;
      const d = Math.hypot(dx, dy);
      if (d >= S.gap) continue;
      // the closer they stand, the harder they part; two on one pixel part to either side
      const push = S.speed * (1 - d / S.gap) * dt;
      const ux = d > 0.01 ? dx / d : a.seed < b.seed ? 1 : -1;
      const uy = d > 0.01 ? dy / d : 0;
      a.x = clamp(a.x - ux * push, S.wall, W - S.wall);
      b.x = clamp(b.x + ux * push, S.wall, W - S.wall);
      a.y -= uy * push;
      b.y += uy * push;
    }
  }
}
