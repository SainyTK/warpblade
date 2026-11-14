import { dealDamage } from "../../../../game/damage";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { createImpact } from "../../../../game/effects/impact";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { game, hero, lights } from "../../../../game/state";
import { shake } from "../../../../game/world";
import type { SourceId } from "../../../../types/build";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { RAIN } from "../../constants/rain";
import { JADE, JADE_SPARKS } from "../../look";
import { drawSpiritSword, drawSwordMotes } from "../art/spiritSword";

/** seconds the motes of a sword that struck last */
const MOTES = 0.3;

/** where a falling sword strikes: a foe, followed as it moves, or a point on the floor */
export type RainMark = { foe: Enemy } | { x: number; y: number };

const markAt = (m: RainMark): [number, number] => ("foe" in m ? enemyCenter(m.foe) : [m.x, m.y]);

/**
 * One sword of Jade Rain: after `delay` it appears high above its mark, slanting in from `lean` pixels to the side, and
 * falls point first at `RAIN.speed` to strike it once for `damage`, then breaks into motes
 */
export function createRainSword(mark: RainMark, delay: number, lean: number, damage: number, source: SourceId): Effect {
  let t = 0;
  let hit = -1;
  const tip = { x: 0, y: 0 };
  const fall = RAIN.height / RAIN.speed;
  return {
    update(dt) {
      t += dt;
      if (hit >= 0) {
        hit += dt;
        return hit < MOTES;
      }
      const u = (t - delay) / fall;
      if (u < 0) return true;
      const [mx, my] = markAt(mark);
      tip.x = mx + lean * (1 - u);
      tip.y = my - RAIN.height * (1 - Math.min(1, u));
      if (u < 1) return true;
      hit = 0;
      if ("foe" in mark && mark.foe.hp > 0) {
        // the swords are his, so a foe facing him takes them from the front
        dealDamage(mark.foe, damage, { fromX: hero.x, kx: 0, ky: -30, heavy: true, source });
        game.fx.push(createImpact(mx, my, Math.sign(-lean) || 1, true, JADE_SPARKS));
      } else game.fx.push(createFloorRing(mx, my, 10, JADE, 0.25));
      lights.add(mx, my, 18, JADE[4], 0.5, 0.15);
      shake(0.06, 1);
      return true;
    },
    draw() {
      if (t < delay) return;
      if (hit >= 0) {
        drawSwordMotes(tip.x, tip.y, hit / MOTES);
        return;
      }
      drawSpiritSword(tip.x, tip.y, Math.atan2(RAIN.height, -lean), 1, 16);
    },
  };
}
