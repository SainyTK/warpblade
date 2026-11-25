import { FH, FW, GROUND, RES } from "../../../constants/stage";
import { bayerAt } from "../../../engine/frame";
import { smoothNoise } from "../../../scene/eras/day/noise";
import type { PlatePaint } from "../../../scene/platePaint";
import type { Color } from "../../../types/color";
import { scale } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { SCENE_COLORS as SC } from "./palette";

const RIVET_EVERY = 8;
const PLATE = 32;
const GRATE = { every: 80, from: 28, width: 16, bar: 3 } as const;
const BAND = { top: 3, bottom: 7 } as const;
const BLOCK = { width: 32, height: 8 } as const;
const HOT_SEAM = 0.28;

function band(x: number, v: number, threshold: number): Color {
  const g = (((x - GRATE.from) % GRATE.every) + GRATE.every) % GRATE.every;
  if (g < GRATE.width) {
    if (g % GRATE.bar < 1 || v < BAND.top + 0.5) return SC.floorIron[2];
    const depth = (v - BAND.top) / (BAND.bottom - BAND.top);
    return SC.grateGlow[Math.max(0, 3 - Math.floor(depth * 3 + threshold))];
  }
  const rx = x % RIVET_EVERY;
  if (Math.hypot(rx - RIVET_EVERY / 2, v - 5) < 0.75) return v < 5 ? SC.rivetLit : SC.rivet;
  if (x % PLATE < 0.5) return SC.floorIron[1];
  return v < BAND.top + 1 ? SC.floorIron[4] : SC.floorIron[3];
}

function blocks(x: number, v: number, threshold: number): Color {
  const course = Math.floor((v - BAND.bottom - 1) / BLOCK.height);
  const shifted = x + (course % 2 ? BLOCK.width / 2 : 0);
  const column = Math.floor(shifted / BLOCK.width) % (FW / RES / BLOCK.width);
  const u = shifted % BLOCK.width;
  const w = (v - BAND.bottom - 1) % BLOCK.height;
  const hot = grain(column, course + 11) < HOT_SEAM;
  if (u < 0.5 || w < 0.5) return hot ? SC.grateGlow[w < 0.5 ? 1 : 2] : SC.floorIron[0];
  const tone = smoothNoise(x, v, 4) * 0.7 + grain(Math.floor(x * RES), Math.floor(v * RES)) * 0.3;
  let c = tone > 0.62 ? SC.floorIron[3] : tone > 0.3 ? SC.floorIron[2] : SC.floorIron[1];
  if (w < 1.5 || u < 1.5) c = SC.floorIron[3];
  if (hot && (u < 1.5 || w < 1.5) && threshold < 0.5) c = SC.grateGlow[0];
  return v > 16 ? scale(c, 0.78) : c;
}

function floorAt(x: number, v: number, threshold: number): Color {
  if (v < 0.5) return grain(Math.floor(x * RES), 3) < 0.2 ? SC.floorLip[2] : SC.floorLip[3];
  if (v < 1) return SC.floorLip[2];
  if (v < 2) return SC.floorLip[1];
  if (v < BAND.top) return SC.floorLip[0];
  if (v < BAND.bottom) return band(x, v, threshold);
  if (v < BAND.bottom + 1) return SC.floorIron[0];
  return blocks(x, v, threshold);
}

export function paintFloor(paint: PlatePaint): void {
  for (let iy = GROUND * RES; iy < FH; iy++)
    for (let ix = 0; ix < FW; ix++)
      paint.plate[iy * FW + ix] = floorAt((ix + 0.5) / RES, (iy + 0.5) / RES - GROUND, bayerAt(ix, iy));
}
