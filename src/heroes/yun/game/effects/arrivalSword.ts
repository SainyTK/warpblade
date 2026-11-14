import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { game } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { ease } from "../../../../utils/math";
import { JADE_SPARKS } from "../../look";
import { drawSpiritSword } from "../art/spiritSword";

/** seconds a sword takes to dive from above onto the foe */
const DIVE = 0.12;

/**
 * One spirit sword that arrives with Yun's warp: it drops from above his shoulder onto the foe and strikes it once,
 * then is back in the fan behind him
 */
export function createArrivalSword(foe: Enemy, fromX: number, fromY: number, delay: number, damage: number): Effect {
  let t = 0;
  let struck = false;
  const tip = { x: fromX, y: fromY };
  return {
    update(dt) {
      t += dt;
      const u = Math.min(1, Math.max(0, (t - delay) / DIVE));
      const [ex, ey] = enemyCenter(foe);
      tip.x = fromX + (ex - fromX) * ease.outQuad(u);
      tip.y = fromY + (ey - fromY) * ease.outQuad(u);
      if (u >= 1 && !struck) {
        struck = true;
        if (foe.hp > 0) {
          dealDamage(foe, damage, { fromX, kx: Math.sign(ex - fromX) * 20 });
          game.fx.push(createImpact(ex, ey, Math.sign(ex - fromX) || 1, false, JADE_SPARKS));
        }
      }
      return t < delay + DIVE + 0.08;
    },
    draw() {
      if (t < delay) return;
      const [ex, ey] = enemyCenter(foe);
      drawSpiritSword(tip.x, tip.y, Math.atan2(ey - fromY, ex - fromX), struck ? 0.5 : 1);
    },
  };
}
