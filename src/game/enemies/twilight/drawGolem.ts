import { detailCanvas, type SpriteCanvas } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import { clipPoly } from "../../../utils/clipPoly";
import { mix, WHITE } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { TWILIGHT_COLORS as TC } from "./colors";
import { fist, leg, limb, shard } from "./golemParts";
import { golemPose, type Pt } from "./golemPose";

const canvas = detailCanvas(56, 50, 28, 45);

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
/** the body shears with the golem's lean: its base stays over the feet and the shoulders move the whole way */
const SHEAR = { from: -3, over: 18, most: 1.3 };
/**
 * the body cut into stone blocks, top course first so each lower block's lit bevel sits under a dark joint; the
 * shoulder slab catches the light, the base sits in the body's own shade
 */
const BLOCKS = (() => {
  const below = (p: readonly Pt[], y: number) => clipPoly(p, 1, y, true);
  const above = (p: readonly Pt[], y: number) => clipPoly(p, 1, y, false);
  const left = (p: readonly Pt[], x: number) => clipPoly(p, 0, x, true);
  const right = (p: readonly Pt[], x: number) => clipPoly(p, 0, x, false);
  const middle = below(above(BODY, SEAM.slab), SEAM.base);
  const base = above(BODY, SEAM.base);
  const slab = { tone: TC.stoneLight, light: TC.stoneRim, dark: TC.stone };
  const chest = { tone: TC.stone, light: TC.stoneLight, dark: TC.stoneDark };
  const foot = { tone: TC.stoneShade, light: TC.stone, dark: TC.stoneDeep };
  return [
    { shape: below(BODY, SEAM.slab), ...slab },
    { shape: left(middle, SEAM.chest), ...chest },
    { shape: right(middle, SEAM.chest), ...chest },
    { shape: left(base, SEAM.foot), ...foot },
    { shape: right(base, SEAM.foot), ...foot },
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
/** the crystal grown out of its back: each shard's foot, tip and half width */
const CRYSTALS: readonly (readonly [Pt, Pt, number])[] = [
  [[-10, -16.5], [-14, -19.5], 1.5],
  [[-8.4, -19], [-10.6, -25.5], 1.9],
  [[-6, -20], [-5.6, -24], 1.4],
];
/** pits and pale chips in the stone, so the blocks are worn */
const PITS: readonly Pt[] = [
  [-8, -11.5],
  [1, -17.5],
  [6, -8],
  [-3, -4.5],
];
const CHIPS: readonly Pt[] = [
  [-5.5, -18.5],
  [7.5, -15],
  [4, -4.5],
];
/** how wide the rune light soaks into the stone around a hot groove */
const BLOOM = { from: 0.35, radius: 1.1, strength: 0.34 };
const ARC_STEPS = 6;

/** a squat stone construct of chiselled blocks, moss and crystal on its shoulders, runes in its chest that blaze before it punches or slams */
export function drawGolem(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const pose = golemPose(e, t);
  const g = pose.heat;
  const { drop } = pose;
  const rune = g > 0.8 ? TC.runeHot : g > 0.4 ? TC.rune : mix(TC.runeDim, TC.rune, g * 2);
  const groove = mix(TC.stoneDeep, TC.runeDim, clamp(g * 1.4));
  const vein = g > 0.55 ? mix(TC.runeDim, TC.rune, clamp((g - 0.55) * 2.2)) : 0;
  const at = (x: number, y: number): Pt => [
    x + pose.lean * clamp((SHEAR.from - y) / SHEAR.over, 0, SHEAR.most),
    y + drop,
  ];
  const placed = (pts: readonly Pt[]): Pt[] => pts.map(([x, y]) => at(x, y));
  const nodded = (pts: readonly Pt[]): Pt[] => pts.map(([x, y]) => at(x, y + pose.nod));
  const hairline = (a: Pt, b: Pt, c: number) => {
    const [x0, y0] = at(a[0], a[1]);
    const [x1, y1] = at(b[0], b[1]);
    s.hairline(x0, y0, x1, y1, c);
  };
  s.clear();
  // back leg and arm, in shadow
  leg(s, at(-4, -5), pose.backFoot, 2.6, true);
  limb(s, at(-5, -16), pose.backFist, 2.4, true);
  fist(s, pose.backFist, 3.2, true, rune, g);
  // the crystal on its back, its heart lit by the runes
  for (const [foot, tip, half] of CRYSTALS)
    shard(s, at(foot[0], foot[1]), at(tip[0], tip[1]), half, g > 0.6 ? WHITE : TC.crystal);
  // the front leg
  leg(s, at(3, -5), pose.frontFoot, 2.8, false);
  // the boulder body, block by block
  for (const block of BLOCKS) {
    s.begin();
    s.poly(placed(block.shape), block.tone);
    s.shadeEdges(block.tone, block.light, block.dark, 2);
    s.commit();
  }
  // wear, a cool rim light down the far side and a crack in the side block, then the joints glowing as the runes heat up
  s.begin();
  for (const [x, y] of PITS) s.set(...at(x, y), TC.stoneDeep);
  for (const [x, y] of CHIPS) s.set(...at(x, y), TC.stoneGlint);
  for (let y = -16; y <= -9; y += 0.5) s.set(...at(9 + (y + 17) / 9 - 0.5, y), TC.stoneRim);
  hairline([-6, -21], [2.5, -21], TC.stoneGlint);
  hairline([6.5, -14], [7.5, -12], TC.stoneDeep);
  hairline([7.5, -12], [6.5, -10], TC.stoneDeep);
  hairline([7, -14], [8, -12], TC.stoneLight);
  s.block(...at(-8.5, -14), TC.stoneRim);
  if (g > 0.3) {
    const seam = mix(TC.stoneDeep, rune, clamp((g - 0.3) * 1.4));
    hairline([-8, SEAM.slab - 0.5], [4, SEAM.slab - 0.5], seam);
    hairline([SEAM.chest - 0.5, SEAM.slab], [SEAM.chest - 0.5, SEAM.base - 1], seam);
    hairline([-9, SEAM.base - 0.5], [SEAM.chest - 1, SEAM.base - 0.5], seam);
  }
  s.commit(false);
  // the runes cut into the chest: their light soaking into the stone, a dark groove, a line of light along it
  s.begin();
  const strokes = (r: number, c: number) => {
    for (const path of CHEST_RUNES)
      for (let i = 1; i < path.length; i++) s.stroke(...at(...path[i - 1]), ...at(...path[i]), r, c);
  };
  if (g > BLOOM.from) strokes(BLOOM.radius, mix(TC.stone, TC.rune, BLOOM.strength * g));
  strokes(0.5, groove);
  for (const path of CHEST_RUNES) for (let i = 1; i < path.length; i++) hairline(path[i - 1], path[i], rune);
  if (g > 0.8) for (const path of CHEST_RUNES) s.set(...at(...path[1]), WHITE);
  s.commit(false);
  // the moss over its shoulders, glowing faintly at the tips, a strand hanging down its back
  s.begin();
  for (const [x, y, r] of MOSS) s.dot(...at(x, y), r, TC.moss);
  s.shadeEdges(TC.moss, TC.mossTip, TC.mossDark, 1);
  hairline([-7.5, -19.5], [-8, -16.5], TC.moss);
  s.set(...at(-8, -16), TC.mossTip);
  s.commit();
  // the head, sunk into the shoulders, a brow over one slit eye with a white hot core
  s.begin();
  s.poly(
    nodded([
      [1, -26],
      [7, -26],
      [8, -20],
      [1, -19],
    ]),
    TC.stoneLight,
  );
  s.shadeEdges(TC.stoneLight, TC.stoneRim, TC.stone, 2);
  const face = (x: number, y: number): Pt => at(x, y + pose.nod);
  s.block(...face(2, -25.5), TC.stoneGlint);
  s.hairline(...face(3.5, -24), ...face(8, -24), TC.stone);
  s.poly(
    nodded([
      [4.5, -23.5],
      [8, -23.5],
      [8, -22],
      [4.5, -22],
    ]),
    TC.stoneDeep,
  );
  if (pose.eye === "shut") s.hairline(...face(5.5, -22.5), ...face(7, -22.5), TC.runeDim);
  else {
    const eye = pose.eye === "hot" ? WHITE : TC.eye;
    s.hairline(...face(5, -23), ...face(7, -23), eye);
    s.hairline(...face(5, -22.5), ...face(7, -22.5), eye);
    s.block(...face(6, -23), WHITE);
    s.hairline(...face(7.5, -23), ...face(7.5, -22.5), rune);
    if (pose.eye === "hot") s.hairline(...face(4.5, -23), ...face(4.5, -22.5), rune);
  }
  s.hairline(...face(5, -21.5), ...face(7, -21.5), TC.stone);
  s.commit();
  // the front arm, the chiselled block over its shoulder and its great fist
  limb(s, at(5, -16), pose.frontFist, 2.6, false, vein);
  s.begin();
  s.poly(
    placed([
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
  s.block(...at(3.5, -18), TC.stoneRim);
  hairline([3, -15.5], [7.5, -15.5], TC.stoneDark);
  s.commit();
  fist(s, pose.frontFist, 3.6, false, rune, g);
  s.outline(TC.outline);
  // light drawn over the outline: the streak behind a punch and the arc between raised fists
  s.begin();
  if (pose.smear > 0) {
    const [fx, fy] = pose.frontFist;
    const reach = 14 * pose.smear;
    const wedge = (half: number, length: number, c: number) =>
      s.poly(
        [
          [fx - 2, fy - half],
          [fx - 2 - length, fy - 0.4],
          [fx - 2 - length, fy + 0.4],
          [fx - 2, fy + half],
        ],
        c,
      );
    wedge(3.2, reach, TC.rune);
    wedge(2, reach * 0.8, TC.runeHot);
    wedge(0.8, reach * 0.6, WHITE);
    s.block(fx + 3.5, fy - 2, WHITE, 0.5, 4);
  }
  if (pose.strain > 0.25) {
    const [ax, ay] = pose.backFist;
    const [bx, by] = pose.frontFist;
    let x = ax;
    let y = ay - 2;
    for (let i = 1; i <= ARC_STEPS; i++) {
      const u = i / ARC_STEPS;
      const jag = i < ARC_STEPS ? Math.sin(t * 53 + i * 2.4) * 2.2 * pose.strain : 0;
      const nx = ax + (bx - ax) * u;
      const ny = ay - 2 + (by - ay) * u - Math.sin(u * Math.PI) * 3 + jag;
      s.hairline(x, y, nx, ny, pose.strain > 0.7 && i % 2 ? WHITE : TC.runeHot);
      x = nx;
      y = ny;
    }
  }
  s.commit(false);
  return s;
}
