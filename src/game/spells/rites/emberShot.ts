import { RITE_RAMP, RITE_SPARKS } from "../../../constants/ysra/emberLook";
import { BRAZIER } from "../../../constants/ysra/rites";
import { circle, glow, place, px } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { WHITE } from "../../../utils/color";
import { dealDamage } from "../../damage";
import { enemyBox } from "../../enemies/enemy";
import { game, particles, progress, rng } from "../../state";
import { boxHit, surfaceBelow } from "../../world";
import { crackle } from "./riteSound";

/** seconds an ember flies before it goes out */
const MAX_FLIGHT = 1.2;

function sparkle(x: number, y: number, n: number): void {
  for (let i = 0; i < n; i++)
    particles.spawn(PK.SPARK, x, y, rng.range(-90, 90), -rng.range(30, 140), rng.range(0.15, 0.35), {
      sparks: RITE_SPARKS,
    });
}

/** an ember spat by the brazier: it arcs to where its foe stood and burns the first foe it touches */
export function createEmberShot(x: number, y: number, tx: number, ty: number): Effect {
  const T = BRAZIER.flight;
  const o = { x, y, vx: (tx - x) / T, vy: (ty - y) / T - 0.5 * BRAZIER.gravity * T, t: 0 };
  return {
    update(dt) {
      o.t += dt;
      o.vy += BRAZIER.gravity * dt;
      o.x += o.vx * dt;
      o.y += o.vy * dt;
      if (rng.chance(0.6))
        particles.spawn(PK.EMBER, o.x, o.y, -o.vx * 0.1, -o.vy * 0.1, rng.range(0.2, 0.4), { sparks: RITE_SPARKS });
      const hit = game.enemies.find((e) => e.hp > 0 && boxHit(enemyBox(e), [o.x - 2, o.y - 2, o.x + 2, o.y + 2]));
      if (hit) {
        dealDamage(hit, progress.stats.ap * BRAZIER.power, { fromX: o.x - Math.sign(o.vx), kx: Math.sign(o.vx) * 50 });
        hit.burn = Math.max(hit.burn, BRAZIER.burn);
        sparkle(o.x, o.y, 8);
        crackle(1.2);
        return false;
      }
      if (o.vy > 0 && o.y >= surfaceBelow(o.x, o.y - o.vy * dt - 1)) {
        sparkle(o.x, o.y, 4);
        return false;
      }
      return o.t < MAX_FLIGHT;
    },
    draw() {
      place();
      circle(o.x, o.y, 1.4, RITE_RAMP[4]);
      px(o.x, o.y, WHITE);
      glow(o.x, o.y, 9, RITE_RAMP[4], 0.5);
    },
  };
}
