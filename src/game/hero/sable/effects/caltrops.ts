import { line, place, px } from "../../../../engine/frame";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { hex, WHITE } from "../../../../utils/color";
import { dealDamage } from "../../../damage";
import { enemyBox } from "../../../enemies/enemy";
import { game, progress, rng } from "../../../state";

/** caltrops lie this long, over this many pixels each side of where she landed */
const LIFE = 3;
const REACH = 30;
const IRON = hex("#5a6468");

/** Hop Volley: iron caltrops scattered where she lands; each foe that walks over them is tripped once */
export function scatterCaltrops(x: number, y: number, power: number): void {
  const spikes = Array.from({ length: 9 }, () => x + rng.range(-REACH, REACH));
  const tripped = new Set<Enemy>();
  let t = 0;
  const effect: Effect = {
    update(dt) {
      t += dt;
      for (const e of game.enemies) {
        if (e.hp <= 0 || e.air || tripped.has(e)) continue;
        const [x0, , x1, y1] = enemyBox(e);
        if (x1 < x - REACH || x0 > x + REACH || y1 < y - 4) continue;
        tripped.add(e);
        dealDamage(e, progress.stats.ad * power, { fromX: x, ky: -30, stun: 0.6, source: "s_hopVolley" });
      }
      return t < LIFE;
    },
    drawBack() {
      place();
      const a = Math.min(1, (LIFE - t) * 3);
      for (const sx of spikes) {
        line(sx - 1, y - 1, sx + 1, y - 1, IRON, a);
        px(sx, y - 2, WHITE, a);
      }
    },
    draw() {},
  };
  game.fx.push(effect);
}
