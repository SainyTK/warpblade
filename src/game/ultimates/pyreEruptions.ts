import { sfx } from "../../services/audio";
import type { Enemy } from "../../types/enemy";
import { dealDamage } from "../damage";
import { createEruption } from "../effects/eruption";
import { createImpact } from "../effects/impact";
import { ignite } from "../enemies/burn";
import { enemyBox, enemyCenter } from "../enemies/enemy";
import { addHeat } from "../hero/ysra/pyre/heat";
import { game } from "../state";
import { boxHit, shake } from "../world";

/** a pillar every this many pixels along the wave's path, a little later the further from where it started */
const GAP = 24;
const LAG = 0.0006;
const HEIGHT = 46;
const WIDTH = 6;
const BURN = 2;

/** one round of eruptions: each foe in a pillar takes `damage` once and gives `heat` Heat */
function eruptions(damage: number, heat: number) {
  const struck = new Set<Enemy>();
  return (x0: number, y0: number, x1: number, y1: number) => {
    for (const e of game.enemies) {
      if (struck.has(e) || e.hp <= 0 || !boxHit(enemyBox(e), [x0, y0, x1, y1])) continue;
      struck.add(e);
      const [cx, cy] = enemyCenter(e);
      dealDamage(e, damage, { fromX: (x0 + x1) / 2, kx: 0, launch: -200, heavy: true, source: "ultimate" });
      ignite(e, BURN);
      if (heat) addHeat(heat);
      game.fx.push(createImpact(cx, cy, 1, true));
    }
  };
}

/** pillars of fire all along the floor the wave crossed, from x0 to x1 */
export function eruptAlong(x0: number, x1: number, floor: number, damage: number, heat: number): void {
  const hit = eruptions(damage, heat);
  const dir = Math.sign(x1 - x0) || 1;
  for (let x = x0 + dir * GAP * 0.5; (x1 - x) * dir >= 0; x += dir * GAP)
    game.fx.push(createEruption(x, floor, HEIGHT, WIDTH, Math.abs(x - x0) * LAG, hit));
  shake(0.25, 3);
  sfx.boom();
}

/** Caldera: the floor the wave crossed keeps erupting once a second for `open` seconds */
export function keepOpen(x0: number, x1: number, floor: number, damage: number, open: number, heat: number): void {
  let t = 0;
  let next = 1;
  game.fx.push({
    update(dt) {
      t += dt;
      if (t >= next) {
        eruptAlong(x0, x1, floor, damage, heat);
        next++;
      }
      return next <= open;
    },
    draw() {},
  });
}
