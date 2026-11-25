import { fleck, glow, glowLine, place } from "../../../engine/frame";
import { GLACIER as G } from "../colors";
import { FALLS } from "./falls";
import { BEAST_EYE } from "./fossils";
import { auroraColor } from "./tone";
import { CRACKS, crackFoot, crackX } from "./vault";

const SHAFT_REACH = 120;
const SHAFT_LEAN = 0.42;

export function drawCaveLight(t: number, k: number): void {
  place();
  const tint = auroraColor(k);
  const bright = auroraColor(k, 1.5);
  for (const cx of CRACKS) {
    const breathe = 0.5 + 0.5 * Math.sin(t * 0.7 + cx);
    const foot = crackFoot(cx);
    glow(crackX(cx, 4), 4, 24, tint, 0.2 + breathe * 0.1);
    glow(crackX(cx, foot), foot, 12, bright, 0.14 + breathe * 0.06);
    glowLine(cx, foot, cx - SHAFT_REACH * SHAFT_LEAN, foot + SHAFT_REACH, 10, tint, 0.04 + breathe * 0.03);
  }
  const eye = 0.5 + 0.5 * Math.sin(t * 0.45);
  glow(BEAST_EYE.x, BEAST_EYE.y, 7, G.aurora[3], 0.08 + eye * 0.1);
  fleck(BEAST_EYE.x - 0.5, BEAST_EYE.y, G.aurora[3], 0.3 + eye * 0.5);
  for (const f of FALLS)
    for (let i = 0; i < 3; i++) {
      const y = (t * 18 + i * 52 + f.x) % 150;
      fleck(f.x + Math.sin(y * 0.2 + i) * f.w * 0.5, y, G.glint, 0.8);
      glow(f.x, y, 5, G.ice[6], 0.06);
    }
}
