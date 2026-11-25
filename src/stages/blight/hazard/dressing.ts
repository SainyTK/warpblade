import { GROUND, W } from "../../../constants/stage";
import { fleck, glow, hairline, place, px } from "../../../engine/frame";
import { stagePlatforms, stageWalls } from "../../../game/adventure";
import type { Platform } from "../../../types/world";
import { grain } from "../../../utils/grain";
import { BLIGHT } from "../colors";

const SLAB_DEPTH = 9;
const B = BLIGHT.bark;
const R = BLIGHT.rot;
const FU = BLIGHT.fungus;

function moss(p: Platform): void {
  for (let x = p.x0; x < p.x1; x++) {
    const g = grain(x, p.y);
    px(x, p.y - 1, g > 0.55 ? R[3] : R[2]);
    if (g > 0.7) px(x, p.y - 2, R[3]);
    if (g > 0.88) fleck(x + 0.5, p.y - 2.5, R[4]);
    if (g < 0.3) fleck(x, p.y + 0.5, R[1]);
  }
}

function mushroom(x: number, y: number, size: number, t: number): void {
  hairline(x, y, x, y - size, BLIGHT.bone[2]);
  for (let dx = -size * 0.8; dx <= size * 0.8; dx += 0.5) fleck(x + dx, y - size - 0.5, FU[2]);
  for (let dx = -size * 0.5; dx <= size * 0.5; dx += 0.5) fleck(x + dx, y - size - 1, FU[3]);
  fleck(x - 0.5, y - size - 1, FU[4]);
  glow(x, y - size, 6 + size, FU[3], 0.18 + Math.sin(t * 1.7 + x) * 0.05);
}

function hangers(p: Platform, bottom: number, t: number): void {
  for (let x = p.x0 + 3; x < p.x1 - 2; x += 5) {
    const g = grain(x, p.y + 3);
    if (g < 0.4) continue;
    const len = 2 + g * 7;
    const sway = Math.sin(t * 1.2 + x) * 0.6;
    hairline(x, bottom, x + sway, bottom + len, g > 0.7 ? B[3] : B[2]);
    if (g > 0.8) px(x + sway - 0.5, bottom + len, BLIGHT.spore[2]);
  }
  const drip = (t * 0.5 + grain(p.x0, 9)) % 1;
  const dx = p.x0 + 4 + grain(p.x0, p.y) * (p.x1 - p.x0 - 8);
  if (drip < 0.8) fleck(dx, bottom + drip * 10, BLIGHT.sap[2], 1 - drip);
}

function slab(p: Platform, t: number): void {
  moss(p);
  hangers(p, p.y + SLAB_DEPTH, t);
  const width = p.x1 - p.x0;
  for (let i = 0; i < 2; i++) {
    const g = grain(p.x0 + i * 13, p.y);
    if (g < 0.35) continue;
    mushroom(p.x0 + 4 + g * (width - 8), p.y - 1, i ? 2 : 3, t);
  }
}

function wall(p: Platform, t: number): void {
  moss(p);
  const height = GROUND - p.y;
  for (let k = 0; k < 3; k++) {
    const x = p.x0 + 4 + k * ((p.x1 - p.x0 - 8) / 2);
    let y = p.y + 3;
    while (y < GROUND - 2) {
      const step = 3 + grain(x, y) * 3;
      const nx = x + (grain(y, x) - 0.5) * 2;
      hairline(x, y, nx, y + step, k === 1 ? B[3] : B[1]);
      y += step;
    }
  }
  const sy = p.y + height * (0.3 + grain(p.x0, 4) * 0.3);
  for (let dx = 0; dx < 5; dx++) {
    fleck(p.x0 - dx * 0.5, sy + dx * 0.2, FU[2]);
    fleck(p.x0 - dx * 0.5, sy - 0.5 + dx * 0.2, FU[3]);
  }
  glow(p.x0 - 1, sy, 7, FU[3], 0.2 + Math.sin(t * 1.5 + p.x0) * 0.05);
  mushroom(p.x1 - 4, p.y - 1, 2, t);
}

export function drawDressing(cameraX: number, t: number): void {
  place();
  const visible = (p: Platform): boolean => p.x1 >= cameraX - 12 && p.x0 <= cameraX + W + 12;
  for (const p of stagePlatforms()) if (visible(p)) slab(p, t);
  for (const p of stageWalls()) if (visible(p)) wall(p, t);
}
