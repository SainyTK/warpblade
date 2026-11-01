import type { Color } from "../types/color";
import { glow, place } from "./frame";

interface Light {
  x: number;
  y: number;
  r: number;
  c: Color;
  k: number;
  life: number;
  max: number;
}

/** Lights that flare and die: brightness falls with life squared. */
export class Lights {
  private list: Light[] = [];
  add(x: number, y: number, r: number, c: Color, k: number, life: number): void {
    this.list.push({ x, y, r, c, k, life, max: life });
  }
  update(dt: number): void {
    for (const o of this.list) o.life -= dt;
    this.list = this.list.filter((o) => o.life > 0);
  }
  draw(): void {
    place();
    for (const o of this.list) {
      const f = o.life / o.max;
      glow(o.x, o.y, o.r * (0.7 + 0.3 * f), o.c, o.k * f * f);
    }
  }
}
