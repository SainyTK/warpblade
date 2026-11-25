import { GROUND, H, RES, W } from "../constants/stage";
import { fleck, place, shade } from "../engine/frame";
import { stagePits } from "../game/adventure";
import type { Platform } from "../types/world";
import { mix, scale } from "../utils/color";
import { grain } from "../utils/grain";
import type { ScenePalette } from "./eras/sceneDef";

const LIP = 2;
const VOID_COLOR = 0x05040a;

function chasm(gap: Platform, palette: ScenePalette, t: number): void {
  const width = gap.x1 - gap.x0;
  const deep = mix(palette.slabUnder, VOID_COLOR, 0.82);
  shade(gap.x0 - LIP, GROUND - 1, gap.x1 + LIP, H, (x, y, out) => {
    const u = x - gap.x0;
    const v = y - GROUND;
    const ragged = 1.5 * grain(Math.floor(y * RES), Math.floor(gap.x0));
    const left = u < ragged;
    const right = u > width - ragged;
    if (u < -LIP || u > width + LIP) return;
    if (left || right) {
      if (u < -LIP + 1 || u > width + LIP - 1) return;
      out.c = scale(palette.slabUnder, 0.6 + 0.3 * grain(Math.floor(x * RES), Math.floor(y * RES)));
      return;
    }
    const fall = Math.min(1, v / 16);
    out.c = mix(scale(palette.slabUnder, 0.45), deep, fall);
  });
  for (let i = 0; i < 4; i++) {
    const rise = (t * (5 + i * 2) + i * 13 + gap.x0) % 22;
    fleck(gap.x0 + width * grain(i, gap.x0), H - rise, palette.mossTip, 0.25 + 0.3 * (1 - rise / 22));
  }
}

export function drawPits(cameraX: number, palette: ScenePalette, t: number): void {
  place();
  for (const gap of stagePits()) {
    if (gap.x1 >= cameraX - 12 && gap.x0 <= cameraX + W + 12) chasm(gap, palette, t);
  }
}
