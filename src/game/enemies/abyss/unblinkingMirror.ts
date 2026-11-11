import type { SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";

/**
 * Draws The Unblinking on its canvas in screen coordinates, mirrored. The canvas lights parts from its top left, and
 * the finished canvas is always shown mirrored (`finish`), so that light lands on the top right, where the black sun
 * hangs, whichever way the eye faces.
 */
export class Mirrored {
  /** -1 while drawing mirrored; once finished, the sign that puts a screen x where it shows */
  private sign = -1;
  constructor(readonly s: SpriteCanvas) {}
  /** start a new drawing, mirrored */
  start(): void {
    this.sign = -1;
  }
  dot(x: number, y: number, r: number, c: Color): void {
    this.s.dot(this.sign * x, y, r, c);
  }
  stroke(x0: number, y0: number, x1: number, y1: number, r: number, c: Color): void {
    this.s.stroke(this.sign * x0, y0, this.sign * x1, y1, r, c);
  }
  /** a taper as SpriteCanvas draws it; bend pushes the middle to the left of the line's direction on screen */
  taper(x0: number, y0: number, x1: number, y1: number, r0: number, r1: number, c: Color, bend = 0): void {
    this.s.taper(this.sign * x0, y0, this.sign * x1, y1, r0, r1, c, this.sign * bend);
  }
  hairline(x0: number, y0: number, x1: number, y1: number, c: Color): void {
    this.s.hairline(this.sign * x0, y0, this.sign * x1, y1, c);
  }
  poly(points: readonly (readonly [number, number])[], c: Color): void {
    this.s.poly(
      points.map(([x, y]) => [this.sign * x, y] as const),
      c,
    );
  }
  /** the image pixel under this point; give a pixel's middle so the mirror lands on the same pixel */
  set(x: number, y: number, c: Color): void {
    this.s.set(this.sign * x, y, c);
  }
  /** an art pixel box with its top left corner on screen at (x, y) */
  block(x: number, y: number, c: Color, w = 1, h = w): void {
    this.s.block(this.sign < 0 ? -x - w : x, y, c, w, h);
  }
  /** the index of the canvas pixel under this point, or -1 off the canvas */
  private at(x: number, y: number): number {
    const { s } = this;
    const ix = Math.floor(this.sign * x * s.res + s.ox);
    const iy = Math.floor(y * s.res + s.oy);
    return ix < 0 || iy < 0 || ix >= s.w || iy >= s.h ? -1 : iy * s.w + ix;
  }
  /** set the pixel under this point only where nothing has been committed yet, so it sits behind what is drawn */
  behind(x: number, y: number, c: Color): void {
    const i = this.at(x, y);
    if (i >= 0 && !this.s.d[i]) this.set(x, y, c);
  }
  /**
   * A foe facing right is shown as drawn, so turn the drawing round to keep it mirrored, then outline it. What is
   * drawn after this lands where it shows, unlit and without an outline: light rather than a shape.
   */
  finish(face: number, outline: Color): void {
    if (face > 0) this.s.mirror();
    this.s.outline(outline);
    this.sign = face > 0 ? 1 : -1;
  }
}
