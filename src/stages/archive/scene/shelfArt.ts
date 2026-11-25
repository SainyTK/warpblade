import type { Color } from "../../../types/color";
import { mix, scale } from "../../../utils/color";
import type { Rng } from "../../../utils/rng";
import { SCENE } from "./palette";

export interface ShelfBay {
  x0: number;
  x1: number;
  top: number;
  bottom: number;
  shelf: number;
  arch: number;
}

export interface ShelfTarget {
  width: number;
  put(x: number, y: number, c: Color): void;
}

const W = SCENE.wood;

function book(t: ShelfTarget, r: Rng, x: number, width: number, base: number, height: number): void {
  const cover = r.pick(SCENE.spines);
  const lean = r.chance(0.08) ? (r.chance(0.5) ? 1 : -1) : 0;
  const band = r.int(1, 2);
  for (let i = 0; i < width; i++)
    for (let h = 0; h < height; h++) {
      const y = base - h;
      const xx = x + i + (lean && h > height / 2 ? lean : 0);
      let c = cover;
      if (i === width - 1 && width > 1) c = scale(cover, 1.35);
      if (i === 0) c = scale(cover, 0.7);
      if (h === band || h === height - 2) c = mix(c, SCENE.giltDim, 0.7);
      if (h === height - 1) c = scale(cover, 0.85);
      t.put(xx, y, c);
    }
}

function rowOfBooks(t: ShelfTarget, r: Rng, x0: number, x1: number, base: number, room: number): void {
  let x = x0;
  while (x < x1) {
    const width = r.int(1, 3);
    if (x + width > x1) break;
    if (r.chance(0.07)) {
      x += r.int(2, 4);
      continue;
    }
    if (r.chance(0.06) && x + 5 < x1) {
      const pile = r.int(2, 3);
      for (let k = 0; k < pile; k++)
        for (let i = 0; i < 5; i++) {
          const c = r.pick(SCENE.spines);
          t.put(x + i, base - k, i === 4 ? scale(c, 1.3) : c);
        }
      x += 6;
      continue;
    }
    book(t, r, x, width, base, Math.max(3, room - r.int(0, 3)));
    x += width;
  }
}

export function paintBay(t: ShelfTarget, r: Rng, bay: ShelfBay): void {
  const { x0, x1, top, bottom, shelf, arch } = bay;
  const mid = (x0 + x1) / 2;
  const half = (x1 - x0) / 2;
  for (let y = top - arch; y < bottom; y++)
    for (let x = x0; x <= x1; x++) {
      const u = (x - mid) / half;
      if (y < top) {
        const rise = (top - y) / arch;
        if (rise > 1 - u * u) continue;
      }
      const edge = x - x0 < 2 || x1 - x < 2;
      let c = edge ? W[1] : W[0];
      if (x1 - x === 0) c = SCENE.woodLit;
      if (x - x0 === 0) c = W[0];
      if (y < top + 1 && !edge) c = W[2];
      t.put(x, y, c);
    }
  for (let y = top - arch; y < top + 2; y++)
    for (let x = x0; x <= x1; x++) {
      const u = (x - mid) / half;
      const rise = (top - y) / arch;
      if (Math.abs(rise - (1 - u * u)) < 0.12) t.put(x, y, W[3]);
    }
  for (let base = top + shelf; base <= bottom; base += shelf) {
    for (let x = x0 + 2; x <= x1 - 2; x++) {
      t.put(x, base, SCENE.shelfLip);
      t.put(x, base + 1, W[2]);
    }
    rowOfBooks(t, r, x0 + 2, x1 - 1, base - 1, shelf - 2);
  }
}
