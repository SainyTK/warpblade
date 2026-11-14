import { hairline, line, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyBox, enemyCenter } from "../../../../game/enemies/enemy";
import { skin } from "../../../../game/hero/skin";
import { game, lights } from "../../../../game/state";
import { boxHit } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { clamp } from "../../../../utils/math";
import { MOONRISE } from "../../constants/abilities";
import { STORE_ANGLE } from "../moves/slashes";
import { storeCut } from "../store";

/** what one wave deals: at once, stored, and to whom it counts */
export interface WaveHit {
  now: number;
  store: number;
}

/**
 * Moonrise's wave: a tall crescent of ink with a white leading edge that runs along the floor from (x, y) in `dir`,
 * leaning ahead, throwing up each foe it meets and storing a cut in it. It thins as it runs out.
 */
export function createInkWave(x: number, y: number, dir: number, hit: WaveHit): Effect {
  const struck = new Set<Enemy>();
  let t = 0;
  const life = MOONRISE.range / MOONRISE.speed;
  const front = (): number => x + dir * MOONRISE.speed * t;
  return {
    update(dt) {
      t += dt;
      const fx = front();
      const box: [number, number, number, number] = [
        Math.min(fx, fx - dir * 10),
        y - MOONRISE.height,
        Math.max(fx, fx - dir * 10),
        y + 2,
      ];
      for (const e of game.enemies) {
        if (e.hp <= 0 || struck.has(e) || !boxHit(box, enemyBox(e))) continue;
        struck.add(e);
        const [cx, cy] = enemyCenter(e);
        game.fx.push(createImpact(cx, cy, dir, false));
        lights.add(cx, cy, 18, skin.ramp[4], 0.3, 0.15);
        dealDamage(e, hit.now, { fromX: fx - dir * 20, kx: dir * 20, launch: MOONRISE.launch, source: "abilities" });
        storeCut(e, hit.store, STORE_ANGLE.rise, "abilities");
      }
      return t < life;
    },
    draw() {
      place();
      const u = clamp(t / life);
      const fx = front();
      const ramp = skin.ramp;
      const h = MOONRISE.height * (1 - u * 0.35);
      for (let k = 0; k < 5; k++) {
        const back = k * 1.6 * (1 - u * 0.5);
        const lean = 7 * (1 - k * 0.12);
        line(
          fx - dir * back,
          y,
          fx - dir * back + dir * lean,
          y - h * (1 - k * 0.1),
          ramp[Math.min(3, k)],
          1 - u * 0.5,
        );
      }
      hairline(fx + dir * 0.6, y, fx + dir * 7.6, y - h, WHITE, 1 - u);
    },
  };
}
