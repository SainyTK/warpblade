import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { boxHit, heroBox, surfaceBelow } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import { clamp } from "../../../../utils/math";
import { GLACIER } from "../../colors";
import { drawFallPath, drawIcicle, drawMark, ICICLE, shatter } from "../../hazard/icicle";

const TOP = 2;

export function createIcicleDrop(x: number, warn: number, damage: number): Effect {
  let t = 0;
  let y = TOP;
  let vy = 0;
  const landing = surfaceBelow(x, TOP + ICICLE.length);
  const struck = new Set<number>();
  return {
    update(dt) {
      t += dt;
      if (t < warn) return true;
      vy += ICICLE.gravity * dt;
      y += vy * dt;
      eachStanding(() => {
        if (struck.has(heroSlot())) return;
        if (!boxHit([x - ICICLE.hitHalf, y + 4, x + ICICLE.hitHalf, y + ICICLE.length], heroBox())) return;
        struck.add(heroSlot());
        hurtHero(damage, x);
      });
      if (y + ICICLE.length < landing) return true;
      shatter(x, landing);
      return false;
    },
    drawBack() {
      const u = clamp(t / warn);
      drawMark(x, landing, u, GLACIER.aurora[4]);
      if (t < warn) drawFallPath(x, TOP + ICICLE.length + 4, landing - 4, u);
    },
    draw() {
      if (t < warn) drawIcicle(x, TOP, Math.min(1, t / 0.25), Math.sin(t * 70) * clamp(t / warn) * 1.2);
      else drawIcicle(x, y, 1, 0);
    },
  };
}
