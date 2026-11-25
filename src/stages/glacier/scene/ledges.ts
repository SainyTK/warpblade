import { GROUND, RES, W } from "../../../constants/stage";
import { bayerAt, place, shade } from "../../../engine/frame";
import { stagePlatforms, stageWalls } from "../../../game/adventure";
import type { Platform } from "../../../types/world";
import { grain } from "../../../utils/grain";
import { GLACIER as G } from "../colors";
import { dithered } from "./tone";

const SLAB_DEPTH = 9;
const DRIP_MAX = 7;
const SLAB_RAMP = G.ice.slice(2, 7);
const WALL_RAMP = G.ice.slice(1, 6);

const capDepth = (x: number, seed: number): number => 1.6 + 0.9 * Math.abs(Math.sin(x * 0.31 + seed));

function drip(u: number, seed: number): { len: number; half: number } | null {
  const slot = Math.floor(u / 7);
  if (grain(slot, seed) < 0.35) return null;
  const center = slot * 7 + 2 + grain(slot, seed + 1) * 3;
  const len = 2 + grain(slot, seed + 2) * (DRIP_MAX - 2);
  const half = 1.3 * (1 - Math.abs(u - center) / 1.6);
  return half > 0 ? { len, half } : null;
}

function slab(p: Platform): void {
  const width = p.x1 - p.x0;
  shade(p.x0 - 1, p.y - 1, p.x1 + 1, p.y + SLAB_DEPTH + DRIP_MAX, (x, y, out) => {
    const u = x - p.x0;
    const v = y - p.y;
    const ix = Math.floor(x * RES);
    const iy = Math.floor(y * RES);
    const end = Math.min(u, width - u);
    const cap = capDepth(x, p.y);
    if (v < 0) {
      if (end > 1.5 && v > -0.6 && Math.sin(x * 0.9 + p.x0) > 0.3) out.c = G.snow[4];
      return;
    }
    if (end < -0.6) return;
    if (v >= SLAB_DEPTH) {
      const d = drip(u, p.y);
      if (!d || v - SLAB_DEPTH > d.len * d.half) return;
      out.c = v - SLAB_DEPTH > d.len * d.half - 1 ? G.ice[6] : u % 7 > 3.5 ? G.ice[5] : G.ice[3];
      return;
    }
    if (end < 0.2 && v > cap) return;
    if (v < 0.5) {
      out.c = G.snow[4];
      return;
    }
    if (v < cap) {
      out.c = v > cap - 0.6 ? G.snow[1] : end < 1 ? G.snow[2] : G.snow[3];
      return;
    }
    if (u >= width - 1) out.c = G.ice[6];
    else if (u < 1) out.c = G.ice[1];
    else if (v > SLAB_DEPTH - 1) out.c = G.ice[1];
    else {
      const facet = Math.floor((u + v * 0.6) / 9);
      const tone = 0.75 - (v - cap) * 0.07 + (grain(facet, p.y) - 0.5) * 0.3;
      out.c = (u + v * 0.6) % 9 < 0.5 ? G.ice[6] : dithered(SLAB_RAMP, tone, ix, iy);
      if (grain(ix, iy) > 0.985) out.c = G.ice[7];
    }
  });
}

function column(p: Platform): void {
  const width = p.x1 - p.x0;
  shade(p.x0, p.y - 1, p.x1, GROUND, (x, y, out) => {
    const u = x - p.x0;
    const v = y - p.y;
    const ix = Math.floor(x * RES);
    const iy = Math.floor(y * RES);
    const cap = capDepth(x, p.x0) + 0.6;
    if (v < 0) {
      if (u > 1.5 && u < width - 1.5 && Math.sin(x * 0.8 + p.y) > 0.4) out.c = G.snow[4];
      return;
    }
    if (u < 0 || u >= width) return;
    if (v < 0.5) out.c = G.snow[4];
    else if (v < cap) out.c = v > cap - 0.6 ? G.snow[1] : G.snow[3];
    else if (u >= width - 1) out.c = G.ice[6];
    else if (u >= width - 2.5) out.c = G.ice[4];
    else if (u < 1) out.c = G.outline;
    else if (u < 2) out.c = G.ice[1];
    else {
      const streak = grain(Math.floor(u / 2.5) + p.x0, 7) * 0.3;
      const core = Math.abs(u - width * 0.45) / (width * 0.5);
      const tone = 0.25 + streak + core * 0.35 - ((v - cap) / (GROUND - p.y)) * 0.25;
      out.c = bayerAt(ix, iy) > 0.94 && grain(ix, iy) > 0.7 ? G.ice[6] : dithered(WALL_RAMP, tone, ix, iy);
    }
  });
}

export function drawIceTerrain(cameraX: number): void {
  place();
  const visible = (x0: number, x1: number): boolean => x1 >= cameraX - 12 && x0 <= cameraX + W + 12;
  for (const p of stageWalls()) if (visible(p.x0, p.x1)) column(p);
  for (const p of stagePlatforms()) if (visible(p.x0, p.x1)) slab(p);
}
