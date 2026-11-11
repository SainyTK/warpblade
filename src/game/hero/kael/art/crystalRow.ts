import type { CrystalRowLook } from "../../../../constants/kael/crystalLook";
import { W } from "../../../../constants/stage";
import { glow, place } from "../../../../engine/frame";
import type { Ramp } from "../../../../types/color";
import type { Effect } from "../../../../types/effect";
import { grain } from "../../../../utils/grain";
import { clamp, ease } from "../../../../utils/math";
import { drawCrystal } from "./crystal";

/** seconds a crystal takes to shoot up */
const RISE = 0.09;
/** the two small crystals at a big one's foot: their offset, and their height as a share of it */
const FOOT = { offset: 4.5, height: [0.45, 0.35] } as const;

/**
 * crystals that shoot up from the floor one after another, outward from (x, floor) to both sides as a front passes
 * them, stand a moment, then sink and break up. Looks only: it touches no foe.
 */
export function createCrystalRow(x: number, floor: number, R: Ramp, look: CrystalRowLook): Effect {
  const count = Math.floor((look.reach - look.start) / look.gap) + 1;
  const life = look.grow + RISE + look.stand + look.sink;
  let t = 0;
  const crystal = (side: number, i: number) => {
    const d = look.start + i * look.gap;
    const cx = x + side * d;
    if (cx < 2 || cx > W - 2) return;
    // the front eases out the same way the ring that calls the row does
    const at = look.grow * (1 - Math.cbrt(1 - Math.min(1, d / look.reach)));
    const u = t - at;
    if (u < 0) return;
    const seed = grain(i, side + x);
    const far = d / look.reach;
    const full = (look.tall + (look.short - look.tall) * far) * (0.75 + 0.5 * seed);
    const out = clamp((u - RISE - look.stand) / look.sink);
    const h = full * clamp(ease.outBack(clamp(u / RISE)), 0, 1.15) * (1 - 0.6 * out);
    const a = out > 0 ? 1.1 - out : 1;
    const w = 2 + full * 0.14;
    const lean = side * (0.5 + 2.5 * grain(side, i));
    drawCrystal(cx - FOOT.offset, floor, h * FOOT.height[0], w * 0.7, lean - 2, R, 0.75, a);
    drawCrystal(cx + FOOT.offset, floor, h * FOOT.height[1], w * 0.7, lean + 2, R, 0.75, a);
    drawCrystal(cx, floor, h, w, lean, R, 1, a);
    if (u < RISE * 3) glow(cx, floor - h * 0.5, 12, R[3], 0.3 * (1 - u / (RISE * 3)));
  };
  return {
    update(dt) {
      t += dt;
      return t < life;
    },
    drawBack() {
      place();
      for (let i = count - 1; i >= 0; i--) {
        crystal(1, i);
        crystal(-1, i);
      }
    },
    draw() {},
  };
}
