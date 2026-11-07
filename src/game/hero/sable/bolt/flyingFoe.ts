import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { dealDamage } from "../../../damage";
import { createImpact } from "../../../effects/impact";
import { enemyBox, enemyCenter } from "../../../enemies/enemy";
import { game, progress } from "../../../state";
import { boxHit, shake } from "../../../world";

/** how long a thrown foe stays a weapon */
const FLIGHT = 0.45;

/**
 * A foe Sable sent flying (a closing bolt or a kick): while it flies it strikes every other foe it touches once, for
 * `power` times her attack damage, and knocks them down. Foes it strikes do not fly on as weapons themselves.
 */
export function createFlyingFoe(body: Enemy, dir: number, power: number): Effect {
  const struck = new Set<Enemy>([body]);
  let t = 0;
  return {
    update(dt) {
      t += dt;
      if (body.hp <= 0) return false;
      const box = enemyBox(body);
      for (const e of game.enemies) {
        if (struck.has(e) || e.hp <= 0 || !boxHit(box, enemyBox(e))) continue;
        struck.add(e);
        const [cx, cy] = enemyCenter(e);
        dealDamage(e, progress.stats.ad * power, { fromX: body.x, kx: dir * 140, ky: -60, stun: 0.6, heavy: true });
        game.fx.push(createImpact(cx, cy, dir, true));
        shake(0.08, 1.2);
      }
      return t < FLIGHT;
    },
    draw() {},
  };
}
