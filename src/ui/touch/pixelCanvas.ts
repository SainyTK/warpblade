import type { Color } from "../../types/color";
import type { SpriteImage } from "../../types/sprite";
import { cb, cg, cr } from "../../utils/color";

/** A small canvas drawn pixel by pixel with see-through colors, then scaled up by CSS with square pixels. */
export class PixelCanvas {
  readonly el: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly image: ImageData;
  constructor(readonly size: number) {
    this.el = document.createElement("canvas");
    this.el.width = size;
    this.el.height = size;
    const ctx = this.el.getContext("2d");
    if (!ctx) throw new Error("This browser cannot draw to a 2D canvas.");
    this.ctx = ctx;
    this.image = ctx.createImageData(size, size);
  }
  clear(): void {
    this.image.data.fill(0);
  }
  put(x: number, y: number, c: Color, alpha: number): void {
    if (x < 0 || y < 0 || x >= this.size || y >= this.size) return;
    this.image.data.set([cr(c), cg(c), cb(c), Math.round(alpha * 255)], (y * this.size + x) * 4);
  }
  /** visit every pixel with its distance from the center and its clock angle: 0 at the top, going clockwise to 1 */
  each(fn: (x: number, y: number, r: number, angle: number) => void): void {
    const c = this.size / 2;
    for (let y = 0; y < this.size; y++)
      for (let x = 0; x < this.size; x++) {
        const dx = x + 0.5 - c;
        const dy = y + 0.5 - c;
        const angle = (Math.atan2(dx, -dy) / (Math.PI * 2) + 1) % 1;
        fn(x, y, Math.hypot(dx, dy), angle);
      }
  }
  /** an opaque sprite centered on the canvas, moved down by `dy`, its colors passed through `paint` */
  sprite(s: SpriteImage, dy: number, paint: (c: Color) => Color): void {
    const left = Math.floor((this.size - s.w) / 2);
    const top = Math.floor((this.size - s.h) / 2) + dy;
    for (let j = 0; j < s.h; j++)
      for (let i = 0; i < s.w; i++) {
        const c = s.d[j * s.w + i];
        if (c) this.put(left + i, top + j, paint(c), 1);
      }
  }
  flush(): void {
    this.ctx.putImageData(this.image, 0, 0);
  }
}
