import { GROUND, RES, W } from "../constants/stage";
import { place, shade } from "../engine/frame";
import { crystalView, stagePlatforms, stageWalls } from "../game/adventure";
import type { Platform } from "../types/world";
import { mix, scale } from "../utils/color";
import { grain } from "../utils/grain";
import { drawCrystal } from "./drawCrystal";
import type { ScenePalette } from "./eras/sceneDef";

const SLAB_DEPTH = 9;
const CRYSTAL_REACH = 40;

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

export function drawAdventureTerrain(cameraX: number, t: number, palette: ScenePalette): void {
  place();
  const visible = (x0: number, x1: number): boolean => x1 >= cameraX - 12 && x0 <= cameraX + W + 12;
  for (const p of stagePlatforms()) {
    if (visible(p.x0, p.x1)) stone(p, p.y + SLAB_DEPTH, palette, false);
  }
  for (const p of stageWalls()) {
    if (visible(p.x0, p.x1)) stone(p, GROUND, palette, true);
  }
  const crystal = crystalView();
  if (crystal && visible(crystal.x - CRYSTAL_REACH, crystal.x + CRYSTAL_REACH)) drawCrystal(crystal, t, palette);
}
