import { GROUND, RES, W } from "../../../constants/stage";
import type { Rng } from "../../../utils/rng";
import { LAYER } from "../../plate";
import type { PlatePaint } from "../../platePaint";
import { hair, type Only } from "./brush";
import { THORN } from "./colors";
import { TOWERS } from "./towers";

/** Thorned growth over the ruins: briars climbing the towers' sides and curled sprouts along the floor's edge. */

const TOWER: Only = [LAYER.tower];
/** a briar's thorns may stick out past the tower's side, over anything further away */
const BEHIND: Only = [LAYER.tower, LAYER.sky, LAYER.celestial, LAYER.ridge];
/** a thorn every this many image pixels along a briar */
const THORN_EVERY = 7;

/** a briar up one side of a tower: a dark stem two image pixels wide, lit on its right, with thorns to both sides */
function briar(p: PlatePaint, r: Rng, x: number, height: number): void {
  const phase = r.range(0, 6);
  const sway = r.range(1.5, 3.5);
  const foot = GROUND * RES - 1;
  for (let i = 0; i < height; i++) {
    const iy = foot - i;
    const ix = Math.round(x + Math.sin(i * 0.11 + phase) * sway + Math.sin(i * 0.37) * 0.8);
    p.put(ix - 1, iy, THORN.dark, TOWER);
    p.put(ix, iy, THORN.body, TOWER);
    p.put(ix + 1, iy, i % 5 < 3 ? THORN.lit : THORN.body, TOWER);
    if (i % THORN_EVERY === 3) {
      const side = (i / THORN_EVERY) % 2 < 1 ? 1 : -1;
      const tx = ix + side * 4;
      hair(p, ix + side, iy, tx, iy - 3, THORN.body, 1, BEHIND);
      p.put(tx, iy - 3, THORN.tip, BEHIND);
    }
  }
}

/** a sprout on the floor's edge: a stem that curls over as it rises and ends in a bright thorn */
function sprout(p: PlatePaint, r: Rng, x: number): void {
  const length = r.range(7, 16);
  const curl = r.range(0.07, 0.16) * (r.chance(0.5) ? 1 : -1);
  let cx = x;
  let cy = GROUND * RES - 1;
  let heading = -Math.PI / 2 - curl * 3;
  for (let i = 0; i < length; i++) {
    const ix = Math.round(cx);
    const iy = Math.round(cy);
    if (iy < GROUND * RES) {
      p.put(ix, iy, i > length - 2 ? THORN.tip : THORN.lit);
      if (i < length * 0.6) {
        p.put(ix - 1, iy, THORN.body);
      }
    }
    cx += Math.cos(heading);
    cy += Math.sin(heading);
    heading += curl;
  }
}

/** static: the growth, thicker and taller toward the era's end */
export function paintThorns(p: PlatePaint, r: Rng, k: number): void {
  TOWERS.forEach(([tx, tw, top], t) => {
    if (t % 3 === 1 && k < 0.5) {
      return;
    }
    const side = t % 2 ? tx + 2 : tx + tw - 4;
    const tall = (GROUND - top) * RES;
    briar(p, r, side * RES, tall * (r.range(0.25, 0.4) + k * 0.2));
  });
  const sprouts = 7 + Math.round(k * 8);
  for (let i = 0; i < sprouts; i++) {
    sprout(p, r, Math.round(r.range(6, W - 6) * RES));
  }
}
