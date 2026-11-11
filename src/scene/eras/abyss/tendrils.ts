import { RES, W } from "../../../constants/stage";
import type { Rng } from "../../../utils/rng";
import type { PlatePaint } from "../../platePaint";
import { ridgeTopAt } from "../../terrain";
import { dab, hair, halo } from "./brush";
import { TENDRIL } from "./colors";

/** Void tendrils rising behind the far ridge: black thorned stalks, lit along their sunward side, a bud of light at each tip. */

/** a thorn every this many image pixels up the stalk */
const THORN_EVERY = 9;

function tendril(p: PlatePaint, r: Rng, k: number): void {
  const bx = r.range(10, W - 10);
  const top = (r.range(78, 98) - k * 12) * RES;
  const base = (ridgeTopAt(Math.round(bx)) + 2) * RES;
  const phase = r.range(0, 6);
  const sway = r.range(3, 7) * RES;
  const at = (iy: number): { x: number; half: number } => {
    const u = (iy - top) / (base - top);
    return { x: bx * RES + Math.sin(u * 5 + phase) * sway * (1 - u * 0.6), half: (0.5 + u * 2.4) * RES * 0.5 + 0.6 };
  };
  // the sunward rim first, a pixel to the right, then the black stalk over it
  for (let iy = Math.floor(top); iy < base; iy++) {
    const s = at(iy);
    dab(p, s.x + 1.4, iy, s.half, TENDRIL.rim);
  }
  for (let iy = Math.floor(top); iy < base; iy++) {
    const s = at(iy);
    dab(p, s.x, iy, s.half, TENDRIL.body);
  }
  for (let iy = Math.floor(top) + THORN_EVERY, n = 0; iy < base; iy += THORN_EVERY, n++) {
    const s = at(iy);
    const side = n % 2 ? 1 : -1;
    const long = 2 + s.half * 0.8;
    const x0 = s.x + side * s.half;
    hair(p, x0, iy, x0 + side * long, iy - long * 0.8, side > 0 ? TENDRIL.rim : TENDRIL.body);
    if (side > 0) {
      p.put(Math.round(x0 + 1), iy, TENDRIL.glint);
    }
  }
  const tip = at(Math.floor(top));
  halo(p, tip.x, top, 5, TENDRIL.bud, 0.5);
  p.put(Math.round(tip.x), Math.floor(top), TENDRIL.bud);
}

/** static: the tendrils, more of them as the era goes on */
export function paintTendrils(p: PlatePaint, r: Rng, k: number): void {
  const n = 3 + Math.round(k * 6);
  for (let i = 0; i < n; i++) {
    tendril(p, r, k);
  }
}
