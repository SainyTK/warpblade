import { FW, GROUND, H, RES, W } from "../../../constants/stage";
import { glow, hairline, shade } from "../../../engine/frame";
import { stagePits } from "../../../game/adventure";
import type { Color } from "../../../types/color";
import type { Platform } from "../../../types/world";
import { grain } from "../../../utils/grain";
import { bridgeColor } from "../scene/bridge";
import { SKYWAY_COLORS as S } from "../scene/palette";
import { rampDither } from "../scene/picture";

const LIP = 2;
const DEPTH = H - GROUND;

const breakAt = (y: number, seed: number): number =>
  1.5 + grain(Math.floor(y * 0.8), seed) * 2.5 + Math.max(0, y - GROUND - 6) * 0.25;

function sky(x: number, y: number, ix: number, iy: number, t: number, gap: Platform): Color {
  const v = (y - GROUND) / DEPTH;
  const tops = H - 6 + Math.sin(x * 0.3 + t * 0.6) * 1.4 + (grain(Math.floor(x * 0.5 + t), 4) - 0.5) * 1.2;
  if (y > tops) return rampDither(S.cloudSea, 0.3 + (H - y) * 0.06, ix, iy);
  const c = rampDither(S.abyss, 0.1 + v * 0.55, ix, iy);
  return y > tops - 1.5 && grain(ix >> 1, gap.x0) > 0.5 ? S.cloudSea[3] : c;
}

function brokenEnd(near: number, y: number, ix: number, iy: number, facing: number): Color {
  const lit = facing > 0;
  if (near < 1) return lit ? S.deck[4] : S.deck[1];
  return rampDither(S.deck, (y - GROUND < 2 ? 0.7 : 0.4) + (grain(ix, iy) - 0.5) * 0.15 - (lit ? 0 : 0.12), ix, iy);
}

function chasm(gap: Platform, t: number): void {
  const width = gap.x1 - gap.x0;
  shade(gap.x0 - LIP, GROUND - 1, gap.x1 + LIP, H, (x, y, out) => {
    if (y < GROUND) return;
    const ix = Math.floor(x * RES);
    const iy = Math.floor(y * RES);
    const u = x - gap.x0;
    const left = breakAt(y, gap.x0);
    const right = breakAt(y, gap.x1 + 7);
    if (u < 0 || u > width) {
      out.c = bridgeColor(((ix % FW) + FW) % FW, iy);
      return;
    }
    if (u < left) {
      out.c = brokenEnd(left - u, y, ix, iy, 1);
      return;
    }
    if (u > width - right) {
      out.c = brokenEnd(u - (width - right), y, ix, iy, -1);
      return;
    }
    out.c = sky(x, y, ix, iy, t, gap);
  });
  const sway = Math.sin(t * 1.7 + gap.x0) * 1.5;
  const rope = gap.x0 + 3;
  hairline(rope, GROUND + 1, rope + 1 + sway, GROUND + 11, S.pole[1]);
  hairline(rope + 1 + sway, GROUND + 11, rope + sway * 1.6, GROUND + 15, S.pole[2]);
  const n = Math.floor(t / 2.3);
  const age = t - n * 2.3;
  if (grain(n, gap.x0) > 0.7 && age < 0.25)
    glow((gap.x0 + gap.x1) / 2, H - 2, width * 0.6, S.stormGlow, 0.5 * (1 - age / 0.25));
}

export function drawAbyss(cameraX: number, t: number): void {
  for (const gap of stagePits()) {
    if (gap.x1 >= cameraX - 12 && gap.x0 <= cameraX + W + 12) chasm(gap, t);
  }
}
