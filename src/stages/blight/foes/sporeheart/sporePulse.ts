import { ellipseRing, fleck, glow, place, px } from "../../../../engine/frame";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Effect } from "../../../../types/effect";
import { clamp, TAU } from "../../../../utils/math";
import { BLIGHT } from "../../colors";

const SPEED = 175;
const REACH = 380;
const BAND = 5;
const MOTES = 48;

export function createSporePulse(cx: number, cy: number, damage: number): Effect {
  const struck = new Set<number>();
  let r = 6;
  let t = 0;
  sfx.boom();
  return {
    update(dt) {
      t += dt;
      r += SPEED * dt;
      eachStanding(() => {
        const slot = heroSlot();
        if (struck.has(slot)) return;
        const [x0, y0, x1, y1] = heroBox();
        const nx = Math.max(x0, Math.min(cx, x1));
        const ny = Math.max(y0, Math.min(cy, y1));
        const near = Math.hypot(nx - cx, ny - cy);
        const far = Math.max(
          Math.hypot(x0 - cx, y0 - cy),
          Math.hypot(x1 - cx, y1 - cy),
          Math.hypot(x0 - cx, y1 - cy),
          Math.hypot(x1 - cx, y0 - cy),
        );
        if (r + BAND < near || r - BAND > far) return;
        struck.add(slot);
        hurtHero(damage, cx);
      });
      return r < REACH;
    },
    draw() {
      place();
      const fade = 1 - clamp(r / REACH) * 0.6;
      ellipseRing(cx, cy, r + 2, r + 2, BLIGHT.spore[1], 0.5 * fade);
      ellipseRing(cx, cy, r, r, BLIGHT.spore[3], fade);
      ellipseRing(cx, cy, r - 1.5, r - 1.5, BLIGHT.spore[4], 0.8 * fade);
      for (let i = 0; i < MOTES; i++) {
        const a = (i / MOTES) * TAU + t * 0.6;
        const wob = Math.sin(i * 2.7 + t * 9) * 2.5;
        const x = cx + Math.cos(a) * (r + wob);
        const y = cy + Math.sin(a) * (r + wob);
        if (i % 3 === 0) px(x - 0.5, y - 0.5, BLIGHT.spore[2], fade);
        else fleck(x, y, BLIGHT.spore[4], fade);
      }
      glow(cx, cy, Math.min(70, r * 0.4 + 10), BLIGHT.spore[2], 0.2 * fade);
    },
  };
}
