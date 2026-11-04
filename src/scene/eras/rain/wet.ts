import { GROUND, PLATFORMS, W } from "../../../constants/stage";
import { bayerAt } from "../../../engine/frame";
import { mix, scale } from "../../../utils/color";
import type { Rng } from "../../../utils/rng";
import { RAIN_COLORS as RC, rainPalette } from "./palette";
import { PUDDLES } from "./weather";

/** Wet stone: sheen glints along the lips, dark water stains down the slab faces and towers, puddles on the floor. */
export function drawWet(bg: Uint32Array, r: Rng, k: number): void {
  const P = rainPalette(k);
  for (let x = 0; x < W; x++) {
    const i = GROUND * W + x;
    if (r.chance(0.2)) bg[i] = mix(bg[i], RC.sheen, r.range(0.4, 0.8));
  }
  for (const p of PLATFORMS) {
    for (let x = p.x0 + 1; x < p.x1; x++) {
      if (r.chance(0.22)) bg[p.y * W + x] = mix(P.slabLip, RC.sheen, r.range(0.4, 0.9));
      if (!r.chance(0.1)) continue;
      const L = r.int(2, 6);
      for (let y = p.y + 2; y < p.y + 2 + L && y < p.y + 8; y++) bg[y * W + x] = scale(bg[y * W + x], 0.78);
    }
  }
  // streaks of rain running down the tower faces
  for (let x = 0; x < W; x++) {
    if (!r.chance(0.16)) continue;
    const y0 = r.int(50, 120);
    const L = r.int(6, 26);
    for (let y = y0; y < Math.min(GROUND, y0 + L); y++) {
      const i = y * W + x;
      if (bg[i] === P.tower) bg[i] = mix(P.tower, RC.stain, 0.6);
    }
  }
  for (const [x0, w] of PUDDLES)
    for (let row = 0; row < 4; row++) {
      const inset = [1, 0, 1, 3][row];
      for (let x = x0 + inset; x < x0 + w - inset; x++) {
        if (x < 0 || x >= W) continue;
        const y = GROUND + row;
        const i = y * W + x;
        const u = (x - x0) / w;
        let c = RC.puddle;
        if (row === 0) c = bayerAt(x, y) < 0.6 ? RC.puddleLip : P.groundLip;
        else if (row === 1 && Math.abs(u - 0.4) < 0.25) c = RC.puddleSky;
        else if (row === 3) c = mix(RC.puddle, P.stone, 0.5);
        bg[i] = c;
      }
    }
}
