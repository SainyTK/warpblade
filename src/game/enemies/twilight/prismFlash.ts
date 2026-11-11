import { fleck, glow, hairline, place, sparkle } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import type { Effect } from "../../../types/effect";
import { scale, WHITE } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { ease, TAU } from "../../../utils/math";
import { PRISM } from "./colors";

const LIFE = 0.18;
const SLIVERS = 7;

/** a burst of prism light where a shard leaves a sprite or shatters: a glint, and slivers of every hue thrown outward */
export function createPrismFlash(x: number, y: number, hue: Color, size: number): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return t < LIFE;
    },
    draw() {
      place();
      const u = t / LIFE;
      const out = ease.outCubic(u) * size;
      for (let i = 0; i < SLIVERS; i++) {
        const a = (i / SLIVERS) * TAU + grain(i, x) * 0.8;
        const far = out * (0.7 + 0.5 * grain(x, i));
        const near = far * (0.35 + 0.5 * u);
        const c = PRISM[i % PRISM.length];
        hairline(
          x + Math.cos(a) * near,
          y + Math.sin(a) * near,
          x + Math.cos(a) * far,
          y + Math.sin(a) * far,
          (v) => (v > 0.7 ? WHITE : c),
          1 - u * 0.6,
        );
        fleck(x + Math.cos(a) * far, y + Math.sin(a) * far, WHITE, 1 - u);
      }
      sparkle(x, y, size * 0.5 * (1 - u), WHITE, hue, 0.5 * (1 - u));
      glow(x, y, size * 1.6, scale(hue, 0.9), 0.5 * (1 - u));
    },
  };
}
