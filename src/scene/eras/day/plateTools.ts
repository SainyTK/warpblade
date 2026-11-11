import { FW, RES, W } from "../../../constants/stage";
import { bayerAt } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import { scale } from "../../../utils/color";
import type { Layer } from "../../plate";
import type { PlatePaint } from "../../platePaint";
import { openSky } from "./openSky";

/** Small helpers for painting fine detail on the day's static scene. Coordinates are image pixels. */

/** make what is there lighter or darker by a factor */
export function tone(paint: PlatePaint, ix: number, iy: number, k: number, only?: readonly Layer[]): void {
  paint.put(ix, iy, scale(paint.get(ix, iy), k), only);
}

/** blend a color in a few even steps, the step chosen by the image grid's dither, so a fade stays pixel art */
export function stepBlend(
  paint: PlatePaint,
  ix: number,
  iy: number,
  c: Color,
  a: number,
  steps: number,
  only?: readonly Layer[],
): void {
  paint.blend(ix, iy, c, Math.floor(a * steps + bayerAt(ix, iy)) / steps, only);
}

/** paint a pixel that stands in front of the sky, so drifting clouds and birds pass behind it */
export function putSolid(paint: PlatePaint, ix: number, iy: number, c: Color, only?: readonly Layer[]): void {
  if (!paint.on(ix, iy, only)) return;
  paint.put(ix, iy, c);
  openSky[iy * FW + ix] = 0;
}

/** the columns to look in for what lies behind an art pixel, nearest first */
const BESIDE = [1, -1, 2, -2, 3, -3];

/**
 * Take away an art pixel a shared part painted in front (a blocky grass tuft or vine) by copying what lies beside it,
 * so finer plants can be drawn in its place.
 */
export function uncover(paint: PlatePaint, x: number, y: number, layer: Layer): void {
  for (const dx of BESIDE) {
    const sx = x + dx;
    if (sx < 0 || sx >= W || paint.layerAt(sx * RES, y * RES) === layer) continue;
    for (let v = 0; v < RES; v++)
      for (let u = 0; u < RES; u++) {
        const to = (y * RES + v) * FW + x * RES + u;
        const from = (y * RES + v) * FW + sx * RES + u;
        paint.plate[to] = paint.plate[from];
        openSky[to] = openSky[from];
      }
    return;
  }
}
