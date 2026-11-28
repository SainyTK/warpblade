import { GROUND } from "../../../../constants/stage";
import { ellipseRing, fleck, glow, place } from "../../../../engine/frame";
import { hero } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { clamp, TAU } from "../../../../utils/math";
import { WARDEN } from "./colors";
import { FLASH } from "./constants";

export const flashCenter = (e: Enemy): [number, number] => [e.x + e.face * FLASH.ahead, e.y - FLASH.height];

export function flashReaches(x: number, y: number): boolean {
  const nx = clamp(x, hero.x - 5, hero.x + 5);
  const ny = clamp(y, hero.y - 32, hero.y);
  return Math.hypot(nx - x, ny - y) <= FLASH.radius;
}

export function createFlashMark(e: Enemy, windup: number): Effect {
  let t = 0;
  const live = () => e.state === "wind" && e.hp > 0 && e.stun <= 0 && !e.air;
  return {
    update(dt) {
      t += dt;
      return live();
    },
    drawBack() {
      place();
      const u = clamp(t / windup);
      const late = u > 0.8;
      const [cx, cy] = flashCenter(e);
      const n = 24;
      for (let i = 0; i < n; i++) {
        if (i % 2 === 1 && !late) continue;
        const a = (i / n) * TAU + t * 0.8;
        fleck(
          cx + Math.cos(a) * FLASH.radius,
          cy + Math.sin(a) * FLASH.radius,
          late ? WARDEN.light[4] : WARDEN.light[2],
          0.3 + u * 0.6,
        );
      }
      ellipseRing(cx, GROUND, FLASH.radius * 0.8, 2, late ? WARDEN.light[4] : WARDEN.light[2], 0.3 + u * 0.6);
      glow(cx, cy, FLASH.radius * (0.4 + u * 0.5), WARDEN.light[2], 0.05 + u * 0.15);
    },
    draw() {},
  };
}
