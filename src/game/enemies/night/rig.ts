import type { SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";

/**
 * Draws a foe on its canvas so the light always comes from the moon's side. The canvas lights parts from its top
 * left, and a foe facing left is shown flipped, which puts that light on the right, where the moon is. A foe facing
 * right is drawn turned round and then mirrored, so its light lands on the right as well. Shapes take the same local
 * coordinates either way, with the foe facing +x.
 */
export class Rig {
  constructor(
    readonly s: SpriteCanvas,
    /** 1 draws as given, -1 draws turned round for the mirror at the end */
    private readonly dir: 1 | -1,
  ) {}
  /** a local x on the canvas, for shapes that are lit there and must not be turned, such as a lit orb's center;
   *  the turned drawing sits one image pixel over, which the mirror takes back */
  x(v: number): number {
    return this.dir > 0 ? v : 1 / this.s.res - v;
  }
  dot(cx: number, cy: number, r: number, c: Color): void {
    this.s.dot(this.x(cx), cy, r, c);
  }
  stroke(x0: number, y0: number, x1: number, y1: number, r: number, c: Color): void {
    this.s.stroke(this.x(x0), y0, this.x(x1), y1, r, c);
  }
  taper(x0: number, y0: number, x1: number, y1: number, r0: number, r1: number, c: Color, bend = 0): void {
    this.s.taper(this.x(x0), y0, this.x(x1), y1, r0, r1, c, bend * this.dir);
  }
  hairline(x0: number, y0: number, x1: number, y1: number, c: Color): void {
    this.s.hairline(this.x(x0), y0, this.x(x1), y1, c);
  }
  set(x: number, y: number, c: Color): void {
    this.s.set(this.x(x), y, c);
  }
  poly(points: readonly (readonly [number, number])[], c: Color): void {
    this.s.poly(
      points.map(([x, y]) => [this.x(x), y] as const),
      c,
    );
  }
  /** pixel rows with their top left corner at this local point, as SpriteCanvas.pixels takes them */
  pixels(rows: readonly string[], map: Record<string, Color>, x: number, y: number): void {
    if (this.dir > 0) {
      this.s.pixels(rows, map, x, y);
      return;
    }
    const res = this.s.res;
    const wide = rows[0].length;
    const turned = rows.map((row) => [...row].reverse().join(""));
    this.s.pixels(turned, map, (1 - Math.floor(x * res) - wide) / res, y);
  }
  /** mirror the turned drawing back, then outline the silhouette */
  finish(outline: Color): void {
    if (this.dir < 0) this.s.mirror();
    this.s.outline(outline);
  }
}

/** the two rigs of one canvas, and the one for the way a foe faces */
export function rigsFor(s: SpriteCanvas): (face: number) => Rig {
  const asDrawn = new Rig(s, 1);
  const turned = new Rig(s, -1);
  return (face) => (face > 0 ? turned : asDrawn);
}
