import { PAL, SPARKS } from "../../constants/palette";
import { W } from "../../constants/stage";
import { glow, line, place, px } from "../../engine/frame";
import type { SourceId } from "../../types/build";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { WHITE } from "../../utils/color";
import { dealDamage } from "../damage";
import { enemyBox } from "../enemies/enemy";
import { type Payoff, payoffLands } from "../skills/payoff";
import { game } from "../state";
import { boxHit } from "../world";
import { createImpact } from "./impact";

const SPEED = 250;
const LIFE = 0.6;
const HALF = 9;

/** a crescent of crystal that flies forward and cuts each foe once (Crystal Lance, Keen Edge's wave); it is not a sword
 *  blow, so guards do not stop it. A precise skill's wave carries its pull-off's payoff and cuts only the foes it lands
 *  on, passing the others by */
export function createCrystalWave(
  x: number,
  y: number,
  face: number,
  damage: number,
  source?: SourceId,
  payoff?: Payoff,
): Effect {
  const o = { x, t: 0 };
  const struck = new Set<Enemy>();
  return {
    update(dt) {
      o.t += dt;
      o.x += face * SPEED * dt;
      for (const e of game.enemies) {
        if (struck.has(e) || e.hp <= 0 || !boxHit([o.x - 3, y - HALF, o.x + 3, y + HALF], enemyBox(e))) continue;
        struck.add(e);
        if (payoff && !payoffLands(payoff, e)) continue;
        dealDamage(e, damage, { fromX: o.x - face * 8, kx: face * 60, source });
        game.fx.push(createImpact(o.x, y, face, false, SPARKS.crystal));
      }
      return o.t < LIFE && o.x > -10 && o.x < W + 10;
    },
    draw() {
      place();
      const k = 1 - o.t / LIFE;
      for (let i = -HALF; i <= HALF; i++) {
        const bow = (1 - (i / HALF) ** 2) * 4 * face;
        px(o.x + bow, y + i, Math.abs(i) < HALF - 2 ? PAL.crystal[4] : PAL.crystal[2], k + 0.2);
        px(o.x + bow - face, y + i, PAL.crystal[2], k * 0.6);
      }
      px(o.x + face * 4, y, WHITE);
      line(o.x - face * 10, y, o.x, y, PAL.crystal[3], k * 0.5);
      glow(o.x, y, 14, PAL.crystal[3], 0.4 * k);
    },
  };
}
