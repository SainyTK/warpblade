import { GROUND, RES } from "../constants/stage";
import { grain } from "../utils/grain";
import { lerp } from "../utils/math";

/** How worn stone varies in brightness, as factors around 1 for any image pixel, so the floor and slabs are not flat color. */

/** the side of a weathering blotch, in image pixels */
const BLOTCH = 24;
const BLOTCH_DEPTH = 0.1;
const FINE_DEPTH = 0.04;
/** the share of pixels that are a dark pit or a pale fleck, and how far each goes */
const PIT = { share: 0.025, depth: 0.09 };
const FLECK = { share: 0.02, depth: 0.06 };
/** how far one floor block can differ from the next */
const BLOCK_DEPTH = 0.1;

/** smooth noise from 0 to 1 that changes over `cell` image pixels */
function blotch(ix: number, iy: number, cell: number): number {
  const gx = ix / cell;
  const gy = iy / cell;
  const x0 = Math.floor(gx);
  const y0 = Math.floor(gy);
  const u = gx - x0;
  const v = gy - y0;
  const top = lerp(grain(x0, y0), grain(x0 + 1, y0), u);
  const bottom = lerp(grain(x0, y0 + 1), grain(x0 + 1, y0 + 1), u);
  return lerp(top, bottom, v);
}

/** weathering blotches and fine grain, scaled by `strength`, with pits and flecks when `chipped` */
export function stoneTone(ix: number, iy: number, strength = 1, chipped = true): number {
  const speck = chipped ? grain(ix + 0.5, iy + 0.5) : 0.5;
  const chip = speck < PIT.share ? -PIT.depth : speck > 1 - FLECK.share ? FLECK.depth : 0;
  const fine = (grain(ix * 3 + 7, iy * 5 + 1) - 0.5) * FINE_DEPTH;
  return 1 + ((blotch(ix, iy, BLOTCH) - 0.5) * BLOTCH_DEPTH + fine + chip) * strength;
}

/** each block of the floor's stone courses is a little lighter or darker than its neighbours; x and y are art pixels */
export function floorBlockTone(x: number, y: number): number {
  const row = y - GROUND;
  if (row < 2) return 1;
  const course = Math.floor((row - 2) / 7);
  const block = Math.floor((x + (course % 2 ? 8 : 0)) / 16);
  return 1 + (grain(course * 13 + 5, block * 7 + 3) - 0.5) * BLOCK_DEPTH;
}

/** the floor's whole tone at an art pixel, for the world drawn beyond the stage at one sample per art pixel */
export const floorToneAt = (x: number, y: number): number =>
  floorBlockTone(x, y) * (1 + (blotch(x * RES, y * RES, BLOTCH) - 0.5) * BLOTCH_DEPTH);
