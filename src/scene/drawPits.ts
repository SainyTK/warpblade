import { GROUND, H, RES, W } from "../constants/stage";
import { fleck, place, shade } from "../engine/frame";
import { stagePits } from "../game/adventure";
import type { Platform } from "../types/world";
import { mix, scale } from "../utils/color";
import { grain } from "../utils/grain";
import type { ScenePalette } from "./eras/sceneDef";

const VOID_COLOR = 0x05040a;

const SIDE = 5;
const COURSE = 6;
const DEPTH = 22;

function sideStone(x: number, y: number, edge: number, palette: ScenePalette): number {
  const v = y - GROUND;
  const course = Math.floor(v / COURSE);
  const fade = Math.min(1, v / DEPTH);
  if (v < 1) return palette.groundLip;
  if (v < 2) return palette.groundEdge;
  if (v % COURSE < 0.5 || (edge + course * 3) % 7 < 0.5) return mix(palette.mortar, VOID_COLOR, fade);
  const tone = 0.62 + 0.22 * grain(Math.floor(x * RES), course + Math.floor(edge));
  return mix(scale(palette.stone, tone), VOID_COLOR, fade * 0.9);
}

function chasm(gap: Platform, palette: ScenePalette, t: number): void {
  const width = gap.x1 - gap.x0;
  const deep = mix(palette.slabUnder, VOID_COLOR, 0.9);
  shade(gap.x0, GROUND, gap.x1, H, (x, y, out) => {
    const u = x - gap.x0;
    const v = y - GROUND;
    if (u < 0 || u > width) return;
    const inset = SIDE * Math.min(1, v / DEPTH);
    if (u < inset) {
      out.c = sideStone(x, y, u, palette);
      return;
    }
    if (u > width - inset) {
      out.c = scale(sideStone(x, y, width - u, palette), 0.7);
      return;
    }
    const fall = Math.min(1, v / DEPTH);
    out.c = mix(scale(palette.slabUnder, 0.4), deep, fall);
  });
  for (let i = 0; i < 4; i++) {
    const rise = (t * (5 + i * 2) + i * 13 + gap.x0) % 22;
    fleck(
      gap.x0 + SIDE + (width - SIDE * 2) * grain(i, gap.x0),
      H - rise,
      palette.mossTip,
      0.25 + 0.3 * (1 - rise / 22),
    );
  }
}

export function drawPits(cameraX: number, palette: ScenePalette, t: number): void {
  place();
  for (const gap of stagePits()) {
    if (gap.x1 >= cameraX - 12 && gap.x0 <= cameraX + W + 12) chasm(gap, palette, t);
  }
}
