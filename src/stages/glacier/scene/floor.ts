import { FH, FW, GROUND, RES, W } from "../../../constants/stage";
import type { PlatePaint } from "../../../scene/platePaint";
import type { Color } from "../../../types/color";
import { mix } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { TAU } from "../../../utils/math";
import { GLACIER as G } from "../colors";
import { dithered } from "./tone";

const BAND = 6.5;
const ICE_RAMP = G.ice.slice(1, 6);

export const snowDepth = (x: number): number =>
  2.6 + 1.1 * Math.sin((x / W) * TAU * 5) + 0.6 * Math.sin((x / W) * TAU * 13 + 1.7);

function floorAt(x: number, v: number, ix: number, iy: number): Color {
  const snow = snowDepth(x);
  if (v < 0.5) return G.snow[4];
  if (v < snow - 1) return grain(ix, 3) > 0.92 ? G.glint : G.snow[3];
  if (v < snow) return G.snow[2];
  if (v < snow + 0.5) return G.snow[0];
  const depth = (v - snow) / (24 - snow);
  const sway = Math.sin((x / W) * TAU * 6 + v * 0.2) * 0.6;
  const layer = (v - snow + sway) / BAND;
  const band = Math.floor(layer);
  const within = layer - band;
  const column = Math.floor(x / 20);
  let c = dithered(ICE_RAMP, 0.7 - depth * 0.75 + (grain(band, 5) - 0.5) * 0.3, ix, iy);
  const seam = grain(band, 11) > 0.35;
  if (seam && within < 0.08) c = G.ice[1];
  else if (seam && within < 0.16) c = mix(c, G.ice[4], 0.5);
  else if (grain(column, band) > 0.72 && Math.abs((x % 20) - 9 - within * 3) < 0.4) c = G.ice[5];
  if (grain(ix * 1.3, iy * 0.7) > 0.994) c = G.ice[6];
  return mix(c, G.cave[1], depth * 0.4);
}

export function paintFloor(paint: PlatePaint): void {
  for (let iy = GROUND * RES; iy < FH; iy++) {
    const v = (iy + 0.5) / RES - GROUND;
    for (let ix = 0; ix < FW; ix++) paint.plate[iy * FW + ix] = floorAt((ix + 0.5) / RES, v, ix, iy);
  }
}
