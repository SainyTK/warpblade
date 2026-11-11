import { GROUND } from "../../../constants/stage";
import { fleck, glow, hairline, line, polygon, toScreenX, toScreenY } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import { WHITE } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { DAY_COLORS as DC } from "./colors";

/** How an Oakheart root looks: the crack that warns of it, and the gnarled root that bursts through the floor. */

type Pt = readonly [number, number];
const B = DC.bark;
/** the root's two sides are drawn as this many straight pieces, enough for its bow to read as a curve */
const PIECES = 8;
/** how far the tip leans, and how far the middle bows out, as shares of the root's height */
const LEAN = 0.18;
const BOW = 0.07;
/** the warning crack: its half length when it opens and when it is about to break, and how jagged it runs */
const CRACK = { opens: 2, breaks: 7, jag: 1.2, pieces: 6, sparks: 4, sparkRise: 7 };

/** the crack in the floor before a root: it runs longer and hotter, with rift sparks rising from it, until the root breaks through */
export function drawRootWarning(x: number, k: number, t: number): void {
  const reach = CRACK.opens + k * (CRACK.breaks - CRACK.opens);
  const body = k > 0.7 ? DC.crackHot : DC.crack;
  let last: Pt = [x - reach, GROUND];
  for (let i = 1; i <= CRACK.pieces; i++) {
    const u = i / CRACK.pieces;
    const jag = i === CRACK.pieces ? 0 : (grain(i, x) - 0.5) * 2 * CRACK.jag;
    const next: Pt = [x - reach + u * reach * 2, GROUND + jag];
    line(last[0], last[1], next[0], next[1], body, 0.5 + k * 0.5);
    if (k > 0.45) hairline(last[0], last[1], next[0], next[1], k > 0.85 ? WHITE : DC.crackHot);
    last = next;
  }
  hairline(x - reach * 0.4, GROUND, x - reach * 0.7, GROUND + 2, DC.crack, k);
  hairline(x + reach * 0.5, GROUND, x + reach * 0.8, GROUND - 1.5, DC.crack, k);
  for (let i = 0; i < CRACK.sparks; i++) {
    const age = (t * 2.4 + i / CRACK.sparks) % 1;
    const sx = x + (grain(i, x + 3) - 0.5) * reach * 1.6;
    fleck(sx, GROUND - 1 - age * CRACK.sparkRise * k, age < 0.4 ? WHITE : DC.crackHot, (1 - age) * k);
  }
  glow(x, GROUND, 6 + k * 6, DC.crack, 0.2 + k * 0.35);
}

/** the bark's tone across the root, from its shaded left to its sunlit right; `across` runs from -1 to 1 */
function barkAt(across: number): Color {
  if (across < -0.4) return B[1];
  if (across < 0.25) return B[2];
  if (across < 0.72) return B[3];
  return B[4];
}

/**
 * a root standing h high at x, HALF wide each side at the floor, leaning toward `lean`; `rising` is true for the
 * instant it shoots up
 */
export function drawRoot(x: number, h: number, HALF: number, lean: number, rising: boolean): void {
  const centre = (u: number): number => x + lean * h * (LEAN * u + BOW * Math.sin(u * Math.PI));
  const half = (u: number): number => HALF * (1 - u) ** 0.85;
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i <= PIECES; i++) {
    const u = i / PIECES;
    left.push([centre(u) - half(u), GROUND - h * u]);
    right.push([centre(u) + half(u), GROUND - h * u]);
  }
  const floor = toScreenY(GROUND);
  polygon([...left, ...right.reverse()], (sx, sy = floor) => {
    const u = Math.min(1, Math.max(0, (floor - sy) / h));
    return barkAt((sx - toScreenX(centre(u))) / (half(u) + 0.5));
  });
  right.reverse();
  // grooves wind up the root, the way a root twists as it grows
  for (let u = 0.12; u < 0.8; u += 0.17)
    hairline(centre(u) - half(u), GROUND - h * u, centre(u + 0.1) + half(u + 0.1) * 0.5, GROUND - h * (u + 0.1), B[0]);
  for (let i = 1; i <= PIECES; i++) {
    hairline(left[i - 1][0], left[i - 1][1], left[i][0], left[i][1], DC.outline);
    hairline(right[i - 1][0], right[i - 1][1], right[i][0], right[i][1], DC.outline);
  }
  const tip = left[PIECES];
  fleck(tip[0], tip[1] - 0.5, DC.outline);
  fleck(tip[0], tip[1], DC.thornTip);
  fleck(tip[0], tip[1] + 0.5, WHITE);
  fleck(tip[0] + 0.5, tip[1] + 1, DC.thornTip);
  if (rising) {
    hairline(tip[0] - 1.5, tip[1] - 1, tip[0] - 1.5, tip[1] - 6, DC.crackHot, (u) => 1 - u);
    hairline(tip[0] + 1.5, tip[1] - 2, tip[0] + 1.5, tip[1] - 8, DC.crackHot, (u) => 1 - u);
  }
  if (h > 10) {
    // a rootlet on each side, and a pair of leaves
    hairline(centre(0.3) - half(0.3), GROUND - h * 0.3, centre(0.3) - half(0.3) - 2.5, GROUND - h * 0.3 - 2, B[1]);
    fleck(centre(0.3) - half(0.3) - 2.5, GROUND - h * 0.3 - 2, DC.thornTip);
    hairline(centre(0.52) + half(0.52), GROUND - h * 0.52, centre(0.52) + half(0.52) + 2, GROUND - h * 0.52 - 2, B[2]);
    fleck(centre(0.52) + half(0.52) + 2, GROUND - h * 0.52 - 2, DC.thornTip);
    const ly = GROUND - h * 0.66;
    const lx = centre(0.66) - half(0.66);
    fleck(lx - 0.5, ly, DC.leaf[2]);
    fleck(lx - 1, ly - 0.5, DC.leaf[3]);
    fleck(lx - 1.5, ly - 0.5, DC.leaf[4]);
    fleck(lx - 1, ly, DC.leaf[1]);
  }
  // the floor it broke heaves up on both sides
  for (const side of [-1, 1]) {
    const bx = x + side * (HALF + 1.5);
    polygon(
      [
        [bx - 2, GROUND],
        [bx + side * 0.5, GROUND - 2.5],
        [bx + 2, GROUND],
      ],
      side > 0 ? B[2] : B[1],
    );
    hairline(bx - 2, GROUND, bx + side * 0.5, GROUND - 2.5, DC.outline);
    hairline(bx + side * 0.5, GROUND - 2.5, bx + 2, GROUND, DC.outline);
    fleck(bx + side * 0.5, GROUND - 1.5, side > 0 ? B[4] : B[2]);
  }
  glow(x, GROUND - 2, 10, DC.crack, 0.25);
}
