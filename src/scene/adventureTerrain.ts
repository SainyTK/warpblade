import { PAL } from "../constants/palette";
import { GROUND, RES, W } from "../constants/stage";
import { ellipseRing, fleck, glow, glowLine, hairline, place, shade } from "../engine/frame";
import { stageExitX, stageGates, stagePlatforms, stageWalls } from "../game/adventure";
import type { Platform } from "../types/world";
import { mix, scale } from "../utils/color";
import { grain } from "../utils/grain";
import type { ScenePalette } from "./eras/sceneDef";

const SLAB_DEPTH = 9;
const EXIT_RADIUS = 11;
const GATE_RADIUS = 5;

function stone(p: Platform, bottom: number, palette: ScenePalette, solid: boolean): void {
  shade(p.x0, p.y, p.x1, bottom, (x, y, out) => {
    const u = x - p.x0;
    const v = y - p.y;
    const width = p.x1 - p.x0;
    if (u < 0 || u >= width || v < 0 || y >= bottom) return;
    if (v < 1) {
      out.c = palette.slabLip;
      return;
    }
    if (v < 2) {
      out.c = palette.slabEdge;
      return;
    }
    if (u < 1 || u >= width - 1 || y >= bottom - 1) {
      out.c = palette.slabUnder;
      return;
    }
    const course = Math.floor((v - 2) / 7);
    const brickX = u + (solid && course % 2 ? 6 : 0);
    const block = Math.floor(brickX / 12);
    if (brickX % 12 < 0.5 || (solid && (v - 2) % 7 >= 6.5)) {
      out.c = palette.mortar;
      return;
    }
    const base = solid ? mix(palette.slab, palette.stone, 0.42) : palette.slab;
    const tone =
      0.88 + grain(block + p.x0, course + p.y) * 0.17 + grain(Math.floor(x * RES), Math.floor(y * RES)) * 0.08;
    out.c = scale(base, (solid && u >= width - 3 ? 0.72 : 1) * tone);
  });
}

function gate(x: number, t: number): void {
  const [dark, , band, light, hot] = PAL.shadow;
  const pulse = 0.6 + Math.sin(t * 5 + x) * 0.17;
  shade(x - GATE_RADIUS, -4, x + GATE_RADIUS, GROUND, (px, py, out) => {
    const d = Math.abs(px - x);
    if (d >= GATE_RADIUS || py >= GROUND) return;
    out.c = d < 1 ? hot : (py + Math.floor(t * 20)) % 14 < 1 ? light : d < 2.5 ? band : dark;
    out.a = (1 - d / GATE_RADIUS) * pulse;
  });
  hairline(x, -4, x, GROUND, light, pulse);
  glowLine(x, -4, x, GROUND, 9, band, pulse * 0.52);
  ellipseRing(x, GROUND, 7, 2, hot, pulse);
}

function exit(x: number, t: number, p: ScenePalette): void {
  const [, dark, mid, light, bright, hot] = PAL.hour;
  const height = 30;
  const top = GROUND - height;
  shade(x - EXIT_RADIUS, top, x + EXIT_RADIUS, GROUND, (px, py, out) => {
    const u = Math.abs(px - x) / EXIT_RADIUS;
    const v = (py - top) / height;
    if (u >= 1 || v < 0 || v >= 1 || (v < 0.33 && u * u + (1 - v / 0.33) ** 2 > 1)) return;
    out.c = u >= 0.81 ? p.slabLip : u >= 0.67 ? light : mix(dark, mid, 0.5 + Math.sin(py * 0.48 + t * 5) * 0.35);
  });
  const y = GROUND - 14;
  hairline(x - 3, y - 3, x + 1, y, bright);
  hairline(x + 1, y, x - 3, y + 3, bright);
  hairline(x + 1, y - 3, x + 5, y, hot);
  hairline(x + 5, y, x + 1, y + 3, hot);
  for (let i = 0; i < 6; i++) {
    const lift = (t * (6 + i) + i * 9) % 26;
    fleck(x + (grain(i, 6) - 0.5) * 13, GROUND - lift, hot, 1 - lift / 26);
  }
  glow(x, y, 22, light, 0.38 + Math.sin(t * 4) * 0.07);
}

export function drawAdventureTerrain(cameraX: number, t: number, palette: ScenePalette): void {
  place();
  const visible = (x0: number, x1: number): boolean => x1 >= cameraX - 12 && x0 <= cameraX + W + 12;
  for (const p of stagePlatforms()) {
    if (visible(p.x0, p.x1)) stone(p, p.y + SLAB_DEPTH, palette, false);
  }
  for (const p of stageWalls()) {
    if (visible(p.x0, p.x1)) stone(p, GROUND, palette, true);
  }
  for (const x of stageGates()) {
    if (visible(x - GATE_RADIUS, x + GATE_RADIUS)) gate(x, t);
  }
  const exitX = stageExitX();
  if (visible(exitX - EXIT_RADIUS, exitX + EXIT_RADIUS)) exit(exitX, t, palette);
}
