import { GROUND, H, RES, W } from "../../../constants/stage";
import { fleck, glow, place, shade } from "../../../engine/frame";
import { stagePits } from "../../../game/adventure";
import type { Platform } from "../../../types/world";
import { grain } from "../../../utils/grain";
import { GLACIER as G } from "../colors";
import { auroraColor, dithered } from "./tone";

const LIP = 2;
const SURFACE = 9;

function pool(gap: Platform, t: number, k: number): void {
  const width = gap.x1 - gap.x0;
  const floe = gap.x0 + width * (0.3 + 0.2 * Math.sin(t * 0.25 + gap.x0));
  shade(gap.x0 - LIP, GROUND, gap.x1 + LIP, H, (x, y, out) => {
    const u = x - gap.x0;
    const v = y - GROUND;
    const ix = Math.floor(x * RES);
    const iy = Math.floor(y * RES);
    const side = Math.min(u, width - u);
    if (side < 0) {
      if (v < 2 + side * 0.5) out.c = v < 0.5 ? G.snow[4] : G.snow[2];
      return;
    }
    const wallDepth = 1.6 + 0.8 * grain(Math.floor(v), gap.x0 + (u < width / 2 ? 0 : 9));
    if (side < wallDepth) {
      out.c = v < 0.5 ? G.snow[3] : side < 0.6 ? G.ice[4] : G.ice[1];
      return;
    }
    if (v < SURFACE) {
      out.c = v < 1.5 ? G.ice[0] : dithered(G.water, 0.7 - (v / SURFACE) * 0.5, ix, iy);
      return;
    }
    const bob = Math.sin(t * 1.3 + gap.x1) * 0.4;
    const floeU = Math.abs(x - floe);
    if (floeU < 4 - Math.max(0, v - SURFACE - 1) && v < SURFACE + 2.5 + bob) {
      out.c = v < SURFACE + 0.8 + bob ? G.snow[3] : G.ice[2];
      return;
    }
    const d = v - SURFACE;
    const ripple = Math.sin(x * 0.55 + t * 1.7 + d * 1.3) + Math.sin(x * 0.21 - t * 0.9);
    if (d < 0.6 || (ripple > 1.55 && d < 9)) {
      out.c = d < 0.6 ? G.water[3] : G.water[2];
      return;
    }
    out.c = dithered(G.water, 0.35 - d * 0.03, ix, iy);
  });
  const sparkle = (t * 0.7 + gap.x0) % 1;
  fleck(gap.x0 + width * grain(Math.floor(t * 0.7 + gap.x0), 3), GROUND + SURFACE + 1, auroraColor(k, 1), 1 - sparkle);
  glow(gap.x0 + width / 2, GROUND + SURFACE + 2, width * 0.5, auroraColor(k), 0.05);
}

export function drawPools(cameraX: number, t: number, k: number): void {
  place();
  for (const gap of stagePits()) if (gap.x1 >= cameraX - 12 && gap.x0 <= cameraX + W + 12) pool(gap, t, k);
}
