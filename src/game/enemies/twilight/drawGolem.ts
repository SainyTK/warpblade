import { detailCanvas, type SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";
import type { Enemy } from "../../../types/enemy";
import { clipPoly } from "../../../utils/clipPoly";
import { mix, WHITE } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { game } from "../../state";
import { TWILIGHT_COLORS as TC } from "./colors";

const canvas = detailCanvas(56, 50, 28, 45);
type Pt = readonly [number, number];

/** the boulder body's outline, feet at y = 0 */
const BODY: readonly Pt[] = [
  [-10, -6],
  [-11, -14],
  [-7, -20],
  [3, -21],
  [9, -17],
  [10, -8],
  [7, -3],
  [-7, -3],
];
/** the seams the body is chiselled along: under the shoulder slab, over the base, and the vertical joints */
const SEAM = { slab: -16.5, base: -6, chest: 4.5, foot: -1 } as const;
/** the body cut into stone blocks, top course first so each lower block's lit bevel sits under a dark joint */
const BLOCKS: readonly (readonly Pt[])[] = (() => {
  const below = (p: readonly Pt[], y: number) => clipPoly(p, 1, y, true);
  const above = (p: readonly Pt[], y: number) => clipPoly(p, 1, y, false);
  const left = (p: readonly Pt[], x: number) => clipPoly(p, 0, x, true);
  const right = (p: readonly Pt[], x: number) => clipPoly(p, 0, x, false);
  const middle = below(above(BODY, SEAM.slab), SEAM.base);
  const base = above(BODY, SEAM.base);
  return [
    below(BODY, SEAM.slab),
    left(middle, SEAM.chest),
    right(middle, SEAM.chest),
    left(base, SEAM.foot),
    right(base, SEAM.foot),
  ];
})();
/** rune glyphs cut into the chest block, each a stroke path */
const CHEST_RUNES: readonly (readonly Pt[])[] = [
  [
    [-3.5, -14.5],
    [-3.5, -12.5],
    [-2, -11],
    [-0.5, -12.5],
    [-0.5, -14.5],
  ],
  [
    [0.5, -9.5],
    [3.5, -9.5],
  ],
  [
    [2, -9.5],
    [2, -7.5],
  ],
  [
    [-6.5, -10],
    [-5, -8.5],
    [-6.5, -7],
  ],
];
/** clumps of moss draped over the shoulder slab, as centre and size */
const MOSS: readonly (readonly [number, number, number])[] = [
  [-6.6, -20, 1.3],
  [-5, -20.4, 1],
  [-3.8, -20, 0.7],
  [-1.6, -20.8, 1.2],
  [0.2, -20.9, 0.9],
];

/** how bright the runes burn: a slow pulse at rest, flaring up through a wind-up */
function runeHeat(e: Enemy, t: number): number {
  const w = waveScale(game.wave).windup;
  if (e.state === "charge") return clamp(e.st / (0.8 * w));
  if (e.state === "wind") return clamp(e.st / (0.6 * w));
  if (e.state === "swipe" || (e.state === "recover" && e.st < 0.15)) return 1;
  return 0.2 + Math.sin(t * 2.2 + e.seed) * 0.12;
}

/** a heavy stone limb lit from the top left, in shadow on the far side of the body */
function limb(s: SpriteCanvas, a: Pt, b: Pt, r: number, far: boolean): void {
  const base = far ? TC.stoneDark : TC.stone;
  s.begin();
  s.stroke(a[0], a[1], b[0], b[1], r, base);
  s.shadeEdges(base, far ? TC.stone : TC.stoneLight, far ? TC.stoneDeep : TC.stoneDark, far ? 1 : 2);
  s.commit();
}

/** a blocky stone fist, its curled fingers jointed toward the front, with a rune on its back that burns with the golem's heat */
function fist(s: SpriteCanvas, [x, y]: Pt, r: number, far: boolean, rune: Color): void {
  const base = far ? TC.stoneDark : TC.stoneLight;
  const joint = far ? TC.stoneDeep : TC.stone;
  const h = r * 0.92;
  const c = r * 0.3;
  s.begin();
  s.poly(
    [
      [x - h + c, y - h],
      [x + h - c, y - h],
      [x + h, y - h + c],
      [x + h, y + h - c],
      [x + h - c, y + h],
      [x - h + c, y + h],
      [x - h, y + h - c],
      [x - h, y - h + c],
    ],
    base,
  );
  s.shadeEdges(base, far ? TC.stone : TC.stoneRim, joint, 2);
  s.hairline(x + h * 0.25, y - h * 0.3, x + h - 0.5, y - h * 0.3, joint);
  s.hairline(x + h * 0.25, y + h * 0.3, x + h - 0.5, y + h * 0.3, joint);
  s.hairline(x + h * 0.25, y - h * 0.3, x + h * 0.25, y + h * 0.7, joint);
  if (!far) {
    s.block(x - h + c, y - h + 0.5, TC.stoneGlint);
    s.block(x - h * 0.5, y - 0.5, rune);
    s.set(x - h * 0.5 + 1, y + 0.5, rune);
  }
  s.commit();
}

/** a squat stone construct of chiselled blocks, moss on its shoulders, runes in its chest that blaze before it punches or slams */
export function drawGolem(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const g = runeHeat(e, t);
  const step = e.state === "walk" ? Math.floor((t + e.seed) * 3) % 2 : 0;
  const slammed = e.state === "recover" && e.n === 1 && e.st < 0.45;
  const raised = e.state === "charge";
  const drop = slammed ? 2 : raised ? -1 : step;
  const rune = g > 0.8 ? TC.runeHot : g > 0.4 ? TC.rune : mix(TC.runeDim, TC.rune, g * 2);
  const groove = mix(TC.stoneDeep, TC.runeDim, clamp(g * 1.4));
  const sunk = (pts: readonly Pt[]): Pt[] => pts.map(([x, y]) => [x, y + drop]);
  const backFist: Pt = raised ? [-3, -31] : slammed ? [-1, -2] : [-9, -7 + step];
  const frontFist: Pt =
    e.state === "wind"
      ? [-4, -17]
      : e.state === "swipe"
        ? [17, -11]
        : raised
          ? [6, -32]
          : slammed
            ? [11, -2]
            : [10, -6];
  s.clear();
  // back leg and arm, in shadow
  limb(s, [-4, -5], [-6 - step, 0], 2.6, true);
  limb(s, [-5, -16 + drop], backFist, 2.4, true);
  fist(s, backFist, 3.2, true, rune);
  // the front leg
  limb(s, [3, -5], [4 + step, 0], 2.8, false);
  // the boulder body, block by block
  for (const block of BLOCKS) {
    s.begin();
    s.poly(sunk(block), TC.stone);
    s.shadeEdges(TC.stone, TC.stoneLight, TC.stoneDark, 2);
    s.commit();
  }
  // a cool rim light down the far side and a crack in the side block, then the joints glowing as the runes heat up
  s.begin();
  for (let y = -16; y <= -9; y += 0.5) s.set(9 + (y + 17) / 9 - 0.5, y + drop, TC.stoneRim);
  s.hairline(-6, -21 + drop, 2.5, -21 + drop, TC.stoneRim);
  s.hairline(6.5, -14 + drop, 7.5, -12 + drop, TC.stoneDeep);
  s.hairline(7.5, -12 + drop, 6.5, -10 + drop, TC.stoneDeep);
  s.hairline(7, -14 + drop, 8, -12 + drop, TC.stoneLight);
  s.block(-8.5, -14 + drop, TC.stoneRim);
  if (g > 0.3) {
    const seam = mix(TC.stoneDeep, rune, clamp((g - 0.3) * 1.4));
    s.hairline(-8, SEAM.slab - 0.5 + drop, 4, SEAM.slab - 0.5 + drop, seam);
    s.hairline(SEAM.chest - 0.5, SEAM.slab + drop, SEAM.chest - 0.5, SEAM.base - 1 + drop, seam);
  }
  s.commit(false);
  // the runes cut into the chest: a dark groove with a line of light along it
  s.begin();
  for (const path of CHEST_RUNES)
    for (let i = 1; i < path.length; i++)
      s.stroke(path[i - 1][0], path[i - 1][1] + drop, path[i][0], path[i][1] + drop, 0.5, groove);
  for (const path of CHEST_RUNES)
    for (let i = 1; i < path.length; i++)
      s.hairline(path[i - 1][0], path[i - 1][1] + drop, path[i][0], path[i][1] + drop, rune);
  s.commit(false);
  // the moss over its shoulders, glowing faintly at the tips
  s.begin();
  for (const [x, y, r] of MOSS) s.dot(x, y + drop, r, TC.moss);
  s.shadeEdges(TC.moss, TC.mossTip, TC.mossDark, 1);
  s.commit();
  // the head, sunk into the shoulders, a brow over one slit eye with a white hot core
  s.begin();
  s.poly(
    sunk([
      [1, -26],
      [7, -26],
      [8, -20],
      [1, -19],
    ]),
    TC.stoneLight,
  );
  s.shadeEdges(TC.stoneLight, TC.stoneRim, TC.stone, 2);
  s.block(2, -25.5 + drop, TC.stoneGlint);
  s.hairline(3.5, -24 + drop, 8, -24 + drop, TC.stone);
  s.poly(
    sunk([
      [4.5, -23.5],
      [8, -23.5],
      [8, -22],
      [4.5, -22],
    ]),
    TC.stoneDeep,
  );
  const eye = g > 0.5 ? WHITE : TC.eye;
  s.hairline(5, -23 + drop, 7, -23 + drop, eye);
  s.hairline(5, -22.5 + drop, 7, -22.5 + drop, eye);
  s.block(6, -23 + drop, WHITE);
  s.hairline(7.5, -23 + drop, 7.5, -22.5 + drop, rune);
  s.hairline(5, -21.5 + drop, 7, -21.5 + drop, TC.stone);
  s.commit();
  // the front arm, the chiselled block over its shoulder and its great fist
  limb(s, [5, -16 + drop], frontFist, 2.6, false);
  s.begin();
  s.poly(
    sunk([
      [3, -18.5],
      [6.5, -19],
      [8, -16.5],
      [7.5, -13.5],
      [4, -13],
      [2.5, -15.5],
    ]),
    TC.stone,
  );
  s.shadeEdges(TC.stone, TC.stoneLight, TC.stoneDark, 2);
  s.block(3.5, -18 + drop, TC.stoneRim);
  s.hairline(3, -15.5 + drop, 7.5, -15.5 + drop, TC.stoneDark);
  s.commit();
  fist(s, frontFist, 3.6, false, rune);
  s.outline(TC.outline);
  return s;
}
