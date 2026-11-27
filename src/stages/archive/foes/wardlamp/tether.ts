import { fleck, glowLine, place } from "../../../../engine/frame";
import { enemyCenter } from "../../../../game/enemies/enemy";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { FOE } from "../colors";

export function createTether(lamp: Enemy, ally: Enemy, life: number): Effect {
  let age = 0;
  return {
    update(dt) {
      age += dt;
      return age < life && lamp.hp > 0 && ally.hp > 0 && lamp.state === "summon";
    },
    draw() {
      place();
      const k = clamp(age / life);
      const [ax, ay] = enemyCenter(ally);
      glowLine(lamp.x, lamp.y + 6, ax, ay, 3, FOE.glyph[2], 0.15 + 0.3 * k);
      const n = 10;
      for (let i = 0; i <= n; i++) {
        const u = (i / n + age * 1.5) % 1;
        if (u > k + 0.15) continue;
        fleck(lamp.x + (ax - lamp.x) * u, lamp.y + 6 + (ay - lamp.y - 6) * u, FOE.glyph[4], 0.8);
      }
    },
  };
}
