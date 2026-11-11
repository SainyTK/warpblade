import { FH, FW, RES, W } from "../constants/stage";
import type { Color } from "../types/color";
import { mix } from "../utils/color";
import { DECORATED, LAYER_MASK, type Layer } from "./plate";

/**
 * Painting on the finished static scene at the frame's full detail. Coordinates are image pixels, FW by FH, with RES
 * of them to an art pixel. Each write can be held to chosen layers, so a far silhouette goes only where the sky shows
 * and a crack only on stone.
 */
export class PlatePaint {
  constructor(
    readonly plate: Uint32Array,
    private readonly layers: Uint8Array,
  ) {}
  private inside(ix: number, iy: number): boolean {
    return ix >= 0 && iy >= 0 && ix < FW && iy < FH;
  }
  private layerIndex(ix: number, iy: number): number {
    return ((iy / RES) | 0) * W + ((ix / RES) | 0);
  }
  /** the layer under an image pixel, or undefined outside the picture */
  layerAt(ix: number, iy: number): Layer | undefined {
    return this.inside(ix, iy) ? ((this.layers[this.layerIndex(ix, iy)] & LAYER_MASK) as Layer) : undefined;
  }
  /** whether the era's own art pixel decoration painted here */
  decoratedAt(ix: number, iy: number): boolean {
    return this.inside(ix, iy) && (this.layers[this.layerIndex(ix, iy)] & DECORATED) !== 0;
  }
  /** whether the pixel is in the picture and, when layers are given, on one of them */
  on(ix: number, iy: number, only?: readonly Layer[]): boolean {
    const layer = this.layerAt(ix, iy);
    return layer !== undefined && (!only || only.includes(layer));
  }
  get(ix: number, iy: number): Color {
    return this.inside(ix, iy) ? this.plate[iy * FW + ix] : 0;
  }
  put(ix: number, iy: number, c: Color, only?: readonly Layer[]): void {
    if (this.on(ix, iy, only)) this.plate[iy * FW + ix] = c;
  }
  /** mix c over what is there by a, from 0 to 1 */
  blend(ix: number, iy: number, c: Color, a: number, only?: readonly Layer[]): void {
    if (a <= 0 || !this.on(ix, iy, only)) return;
    const i = iy * FW + ix;
    this.plate[i] = mix(this.plate[i], c, Math.min(1, a));
  }
}
