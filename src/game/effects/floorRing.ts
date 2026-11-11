import { glow, hairline, place } from "../../engine/frame";
import type { Ramp } from "../../types/color";
import type { Effect } from "../../types/effect";
import { scale } from "../../utils/color";
import { grain } from "../../utils/grain";
import { ease } from "../../utils/math";
import { floorArc } from "./fine";

/** the ring starts to break into dashes this far through its life */
const BREAK_FROM = 0.45;
/** the wake inside the front, in art pixels behind it */
const WAKE = [1.5, 3.5] as const;
/** the near front burns in the ramp's lightest color for this share of its life */
const HOT_UNTIL = 0.35;
/** licks of light standing on the near rim while the ring is young */
const LICKS = 7;
const LICK_HEIGHT = 4;

/**
 * a ring that runs out along the floor: its far half behind the characters, thin and dim; its near half in front,
 * thick and bright, with a hot front, a cooler wake and short licks of light, breaking into dashes as it dies
 */
export function createFloorRing(x: number, y: number, radius: number, ramp: Ramp, life = 0.4, sy = 0.24): Effect {
  let t = 0;
  const top = ramp.length - 1;
  const seed = Math.floor(x * 7 + radius * 13);
  const draw = (half: number) => {
    place();
    const u = t / life;
    const r = radius * ease.outExpo(u);
    const k = 1 - u;
    const c = ramp[Math.min(top, Math.floor(k * ramp.length))];
    const wear = Math.max(0, (u - BREAK_FROM) / (1 - BREAK_FROM)) * 0.8;
    const near = half > 0;
    const strength = near ? 1 : 0.6;
    floorArc(x, y, r - WAKE[1], (r - WAKE[1]) * sy, scale(c, 0.55), k * 0.7 * strength, half, wear + 0.2, seed + 2);
    floorArc(x, y, r - WAKE[0], (r - WAKE[0]) * sy, scale(c, 0.8), k * 1.2 * strength, half, wear, seed + 1);
    floorArc(x, y, r, r * sy, near && u < HOT_UNTIL ? ramp[top] : c, k * 2 * strength, half, wear, seed);
    if (!near) return;
    for (let i = 0; i < LICKS; i++) {
      const g = ((i + grain(i, seed)) / LICKS) * Math.PI;
      const h = LICK_HEIGHT * k * k * (0.4 + 0.6 * grain(seed, i)) * Math.sin(g);
      if (h < 0.6) continue;
      const lx = x + Math.cos(g) * r;
      const ly = y + Math.sin(g) * r * sy;
      hairline(lx, ly - h, lx, ly, (v) => (v > 0.5 ? ramp[top] : c), k);
    }
    glow(x, y, r * 0.8, ramp[top - 1], 0.18 * k);
  };
  return {
    update(dt) {
      t += dt;
      return t < life;
    },
    drawBack: () => draw(-1),
    draw: () => draw(1),
  };
}
