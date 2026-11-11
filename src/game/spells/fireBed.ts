import { glow, hairline } from "../../engine/frame";
import type { Color } from "../../types/color";
import { grain } from "../../utils/grain";
import { TAU } from "../../utils/math";

/** a fire's colors from its white-hot root to its dark edge */
export interface FireColors {
  hot: Color;
  bright: Color;
  body: Color;
  edge: Color;
  deep: Color;
}

/** the tongues of flame: the gap between them and how high the tallest stands, in art pixels */
const TONGUES = { gap: 2.5, height: 6 } as const;

/**
 * a strip of burning floor `half` to each side of (x, y) at time t: a bed of embers along the floor, then tongues of
 * flame standing in it, each swaying on its own beat and shorter toward the strip's ends. `k` fades the whole fire.
 * Call after `place()`.
 */
export function drawFireBed(x: number, y: number, half: number, t: number, k: number, c: FireColors): void {
  const count = Math.max(1, Math.floor((half * 2) / TONGUES.gap));
  const beatNow = Math.floor(t * 10);
  hairline(
    x - half,
    y - 0.25,
    x + half,
    y - 0.25,
    (u) => (grain(Math.floor(u * half), beatNow) > 0.5 ? c.body : c.edge),
    k,
  );
  hairline(x - half + 1, y + 0.25, x + half - 1, y + 0.25, c.deep, k * 0.8);
  for (let i = 0; i <= count; i++) {
    const tx = x - half + i * TONGUES.gap + (grain(i, x) - 0.5) * TONGUES.gap;
    const edge = 1 - Math.abs((i / count) * 2 - 1) ** 3;
    const beat = t * (7 + 5 * grain(x, i)) + grain(i, 7) * TAU;
    const h = TONGUES.height * edge * k * (0.45 + 0.55 * Math.abs(Math.sin(beat)));
    if (h < 0.8) continue;
    const sway = Math.sin(beat * 1.7) * 1.2;
    hairline(tx - 0.5, y, tx - 0.5 + sway * 0.5, y - h * 0.6, c.edge, k);
    hairline(tx + 0.5, y, tx + 0.5 + sway * 0.5, y - h * 0.7, c.body, k);
    hairline(tx, y, tx + sway, y - h, (u) => (u < 0.3 ? c.hot : u < 0.65 ? c.bright : c.edge), k);
  }
  glow(x, y - 2, half * 0.8, c.body, 0.3 * k);
}
