import { circle, fleck, hairline, line, place } from "../../../../engine/frame";
import { skin } from "../../../../game/hero/skin";
import { lights, rng } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import { WHITE } from "../../../../utils/color";
import { clamp, ease, TAU } from "../../../../utils/math";
import { STORE_LOOK } from "../../constants/release";

/** one drop of ink thrown off a burst */
interface Drop {
  a: number;
  speed: number;
  r: number;
}

/**
 * Stored cuts bursting on a foe: each stored line snaps out long across the foe and splits open in ink with a white
 * edge, drops of ink fly off and slow, and the whole thing thins away. `angles` are the stored lines; a big burst is a
 * full release.
 */
export function createInkBurst(x: number, y: number, angles: readonly number[], big: boolean): Effect {
  const drops: Drop[] = Array.from({ length: big ? 9 : 5 }, () => ({
    a: rng.range(0, TAU),
    speed: rng.range(14, big ? 34 : 24),
    r: rng.range(0.7, 1.6),
  }));
  const ramp = skin.ramp;
  lights.add(x, y, big ? 30 : 20, ramp[4], big ? 0.5 : 0.35, 0.2);
  const life = STORE_LOOK.burst;
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return t < life;
    },
    draw() {
      place();
      const u = clamp(t / life);
      const open = ease.outExpo(clamp(u * 3));
      const half = STORE_LOOK.line * (0.6 + open * (big ? 1.1 : 0.7));
      const width = (1 - u) * (big ? 2.2 : 1.5);
      for (const a of angles) {
        const c = Math.cos(a);
        const s = Math.sin(a);
        const nx = -s;
        const ny = c;
        for (let w = -width; w <= width; w += 0.5) {
          const k = Math.abs(w) / Math.max(0.5, width);
          line(
            x - c * half * (1 - k * 0.4) + nx * w,
            y - s * half * (1 - k * 0.4) + ny * w,
            x + c * half * (1 - k * 0.4) + nx * w,
            y + s * half * (1 - k * 0.4) + ny * w,
            ramp[k > 0.6 ? 2 : 1],
            1 - u * 0.6,
          );
        }
        hairline(
          x - c * half + nx * (width + 0.5),
          y - s * half + ny * (width + 0.5),
          x + c * half + nx * (width + 0.5),
          y + s * half + ny * (width + 0.5),
          WHITE,
          1 - u,
        );
      }
      const fly = ease.outQuad(u);
      for (const d of drops) {
        const dx = x + Math.cos(d.a) * d.speed * fly;
        const dy = y + Math.sin(d.a) * d.speed * fly + u * u * 6;
        circle(dx, dy, d.r * (1 - u * 0.7), ramp[1]);
        fleck(dx - 0.5, dy - 0.5, ramp[5], 1 - u);
      }
    },
  };
}
