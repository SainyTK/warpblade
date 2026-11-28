import { GROUND } from "../../../constants/stage";
import { fleck, glow, glowLine, place, viewX } from "../../../engine/frame";
import type { Point } from "../../../types/world";
import { grain } from "../../../utils/grain";
import { ceilingAt } from "./cavern";
import { drawChains } from "./chains";
import { SCENE_COLORS as SC } from "./palette";
import { CHIMNEY_TOPS, FALLS } from "./structures";

const HEAT_GLOWS = [60, 160, 260];
const FALL_DROPS = 6;
const FALL_SPEED = 70;

let windows: readonly Point[] = [];

export function setWindows(lit: readonly Point[]): void {
  windows = lit;
}

function falls(t: number, k: number): void {
  for (const f of FALLS) {
    if (f.from > k) continue;
    const top = ceilingAt(f.x);
    glowLine(f.x, top, f.x, GROUND - 10, 7 + f.half * 2, SC.glow, 0.12);
    for (let i = 0; i < FALL_DROPS; i++) {
      const y = top + ((t * FALL_SPEED + i * 23 + f.x) % (GROUND - top));
      fleck(f.x + Math.sin(y * 0.21 + f.x) * 0.6, y, i % 2 ? SC.ember[3] : SC.ember[2]);
    }
  }
}

function chimneys(t: number): void {
  CHIMNEY_TOPS.forEach(([x, y], i) => {
    glow(x, y, 7, SC.glow, 0.16 + Math.sin(t * 4 + i) * 0.05);
    const rise = (t * 9 + i * 5) % 14;
    fleck(x + Math.sin(t * 2 + i) * 1.5, y - rise, SC.ember[1], 1 - rise / 14);
  });
}

function flicker(t: number): void {
  windows.forEach((w, i) => {
    const beat = Math.sin(t * (2 + grain(i, 9) * 3) + i) * 0.5 + 0.5;
    glow(w.x + 0.5, w.y + 1, 4, SC.hot, 0.08 + beat * 0.1);
  });
}

export function drawForgeAmbient(t: number, k: number): void {
  place();
  for (const [i, x] of HEAT_GLOWS.entries())
    glow(x, GROUND - 6, 44, SC.glow, 0.11 + k * 0.04 + Math.sin(t * 1.3 + i) * 0.03);
  falls(t, k);
  chimneys(t);
  flicker(t);
  drawChains(viewX(), t);
}
