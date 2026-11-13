import { BRANNOC_SKIN } from "../../../../constants/characters/brannoc/look";
import { COIN_GOLD, PAL } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import { hex, mix } from "../../../../utils/color";
import { TAU } from "../../../../utils/math";
import { fill } from "../parts";
import { seg } from "../ysra/parts";

/**
 * Small drawing parts for Brannoc's 16 x 16 icons: his great axe and a hand axe, blood drops, slashes, cracks, an HP
 * bar, a round shield, an open palm, a stitched hide, and pixel heads for his wolf, his ravens, a forebear's helm and
 * his own roar. An evolved icon draws the same parts lit in gold.
 */
type S = SpriteCanvas;
type Point = readonly [number, number];

export { seg };
/** his crimson, clotted to pale */
export const R = PAL.rage;
/** his look's colours: the axe's ash haft and iron head, the bone of his war paint and bindings, his skin and mane */
export const BC = BRANNOC_SKIN.colors;
export const GOLD = COIN_GOLD[3];
export const GOLD_LIGHT = COIN_GOLD[4];
export const GOLD_DARK = COIN_GOLD[2];
/** the ash haft and its lit side, a shade lighter than his look's so they read on the dark disc */
const ASH = hex("#5c4836");
const ASH_LIGHT = hex("#8a7058");
/** a raven's feathers and a forebear's ghost light */
const RAVEN = hex("#4a4256");
const RAVEN_LIGHT = hex("#948aa4");
const GHOST = mix(R[4], R[5], 0.25);

/** the clotted crimson of the disc behind his icons */
const DISC = mix(R[0], R[1], 0.6);

/** the disc behind every one of his icons: dark crimson in a bone rim, lit along its upper edge; gold for an evolution */
export function rageDisc(s: S, gold = false): void {
  fill(s, () => s.dot(8, 8.5, 7, DISC));
  fill(s, () => {
    for (let a = 0; a < TAU; a += 0.12) {
      const lit = a > Math.PI * 1.05 && a < Math.PI * 1.95;
      const c = gold ? (lit ? GOLD_LIGHT : GOLD_DARK) : lit ? BC.trimLight : BC.trimDark;
      s.set(8 + Math.cos(a) * 6.9 - 0.5, 8.5 + Math.sin(a) * 6.9 - 0.5, c);
    }
  });
}

/** a point `along` pixels from (x, y) toward the head and `side` pixels across, to the blade's side */
type Frame = (along: number, side: number) => Point;
function frameAt(x0: number, y0: number, x1: number, y1: number, side: number): Frame {
  const L = Math.hypot(x1 - x0, y1 - y0) || 1;
  const ux = (x1 - x0) / L;
  const uy = (y1 - y0) / L;
  return (along, across) => [x1 + ux * along - uy * across * side, y1 + uy * along + ux * across * side];
}

/** the bearded head's outline in (along, across) from the top of the haft: a narrow neck, the upper horn sweeping up
 *  past the haft, the long curved edge, and the beard hooking down the haft, then back in to the neck */
const HEAD: readonly Point[] = [
  [0.2, 0.6],
  [0.4, 2.6],
  [1.6, 5],
  [2.6, 6.4],
  [1.2, 7.4],
  [-1.6, 7.8],
  [-4.2, 7.4],
  [-6, 6.6],
  [-4.4, 5.2],
  [-2.6, 3.4],
  [-2, 0.6],
];
/** the dark iron of the neck, where the head is socketed on the haft */
const NECK: readonly Point[] = [
  [0.2, 0.6],
  [0.4, 2.4],
  [-2.4, 2.8],
  [-2, 0.6],
];
/** the cutting edge, from the horn to the beard */
const EDGE: readonly Point[] = [
  [2.4, 6.4],
  [1.2, 7.4],
  [-1.6, 7.8],
  [-4.2, 7.4],
  [-5.8, 6.6],
];

/** the colours of an axe: its head, its edge, and the edge a bloodied or gold one shows */
interface AxeLook {
  /** gold: the evolved form, lit gold */
  gold?: boolean;
  /** bloody: its edge running crimson */
  bloody?: boolean;
  /** how big the head is, 1 for the great axe */
  size?: number;
  /** -1 turns the blade to the other side of the haft */
  side?: number;
}

/**
 * An axe from the grip at (x0, y0) to the head at (x1, y1): a dark ash haft lit down one side and bound in bone, a
 * bearded iron head with a pale edge, and a short poll behind it.
 */
export function axe(s: S, x0: number, y0: number, x1: number, y1: number, look: AxeLook = {}): void {
  const { gold = false, bloody = false, size = 1, side = 1 } = look;
  const at = frameAt(x0, y0, x1, y1, side);
  const [tx, ty] = at(1.2 * size, 0);
  const [bx, by] = at(-Math.hypot(x1 - x0, y1 - y0) + 1.5, 0);
  fill(s, () => {
    s.stroke(x0, y0, tx, ty, 0.6, ASH);
    seg(s, ...at(-0.6, -0.5), ...at(-Math.hypot(x1 - x0, y1 - y0) + 0.6, -0.5), ASH_LIGHT);
    s.set(bx, by, gold ? GOLD : BC.trim);
  });
  fill(s, () => {
    s.poly(
      [at(0.2 * size, -0.4), at(0, -1.6 * size), at(-1.2 * size, -1.6 * size), at(-1.4 * size, -0.4)],
      gold ? GOLD_DARK : BC.bladeBack,
    );
  });
  fill(s, () => {
    s.poly(
      HEAD.map(([a, c]) => at(a * size, c * size)),
      gold ? GOLD : BC.blade,
    );
    s.poly(
      NECK.map(([a, c]) => at(a * size, c * size)),
      gold ? GOLD_DARK : BC.bladeBack,
    );
    const edge = EDGE.map(([a, c]) => at(a * size, c * size - 0.7));
    const ec = bloody ? (gold ? R[4] : R[3]) : gold ? GOLD_LIGHT : BC.bladeEdge;
    for (let i = 1; i < edge.length; i++) seg(s, ...edge[i - 1], ...edge[i], ec);
    s.set(...at(-0.8 * size, 4.4 * size), gold ? GOLD_LIGHT : BC.steelLight);
  });
}

/** a hand axe turned to angle `a` round its middle at (cx, cy), len long, its head `size` of the great axe's */
export function handAxe(s: S, cx: number, cy: number, a: number, len: number, gold = false, size = 0.6): void {
  const dx = (Math.cos(a) * len) / 2;
  const dy = (Math.sin(a) * len) / 2;
  axe(s, cx - dx, cy - dy, cx + dx, cy + dy, { gold, size });
}

/** a drop of blood hanging from its tip, its round end at (x, y), r across, lit at its upper left */
export function blood(s: S, x: number, y: number, r: number, c: Color = R[3], light: Color = R[5]): void {
  fill(s, () => {
    s.dot(x, y, r, c);
    s.poly(
      [
        [x - r * 0.8, y - r * 0.4],
        [x + r * 0.8, y - r * 0.4],
        [x, y - r * 2.3],
      ],
      c,
    );
    s.set(x - r * 0.45, y - r * 0.35, light);
  });
}

/** a clean slash from (x0, y0) to (x1, y1), thick in its middle with a bright cut along it, a drop hanging off it */
export function slash(s: S, x0: number, y0: number, x1: number, y1: number, c: Color = R[3], drip = true): void {
  const mx = (x0 + x1) / 2;
  const my = (y0 + y1) / 2;
  fill(s, () => {
    s.taper(x0, y0, mx, my, 0.3, 0.7, c);
    s.taper(mx, my, x1, y1, 0.7, 0.3, c);
    seg(s, (x0 + mx) / 2, (y0 + my) / 2, (mx + x1) / 2, (my + y1) / 2, R[5]);
  });
  if (drip) blood(s, mx + 0.5, my + 3.5, 0.7);
}

/** claw tears raked down from (x, y0) to row y1, one for each x: curved, ragged, thick in the middle, a dark wound
 *  in each between its torn red lips */
export function claws(s: S, xs: readonly number[], y0: number, y1: number, lip: Color = R[4]): void {
  const lean = (y1 - y0) * 0.3;
  for (const x of xs) {
    const my = (y0 + y1) / 2;
    fill(s, () => {
      s.taper(x, y0, x + lean / 2, my, 0.3, 1.1, lip, -0.6);
      s.taper(x + lean / 2, my, x + lean, y1, 1.1, 0.3, lip, -0.6);
      for (let y = y0 + 2; y <= y1 - 2; y++) {
        const u = (y - y0) / (y1 - y0);
        s.set(x + lean * u - 0.6 * Math.sin(Math.PI * u) + ((y % 2) - 0.5) * 0.6, y, R[1]);
      }
    });
  }
}

/** a floor line from x0 to x1 at y */
export function floor(s: S, x0: number, x1: number, y: number, c: Color = R[2]): void {
  fill(s, () => seg(s, x0, y, x1, y, c));
}

/** a crack zigzagging through the points, in its own dark with a lit lip */
export function crack(s: S, pts: readonly Point[], c: Color = R[0], lip: Color = R[4]): void {
  fill(s, () => {
    for (let i = 1; i < pts.length; i++) seg(s, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], c);
    for (let i = 1; i < pts.length; i++) seg(s, pts[i - 1][0], pts[i - 1][1] - 1, pts[i][0], pts[i][1] - 1, lip);
  });
}

/** short lines bursting out of (x, y) */
export function burst(s: S, x: number, y: number, r: number, c: Color, n = 8, turn = 0.4): void {
  fill(s, () => {
    for (let k = 0; k < n; k++) {
      const a = (k / n) * TAU + turn;
      seg(s, x + Math.cos(a) * r * 0.5, y + Math.sin(a) * r * 0.5, x + Math.cos(a) * r, y + Math.sin(a) * r, c);
    }
  });
}

/** an HP bar w wide from (x, y) in a bone frame, holding only a sliver of `left` pixels */
export function hpBar(s: S, x: number, y: number, w: number, left: number, gold = false): void {
  fill(s, () => {
    s.block(x, y, gold ? GOLD_DARK : BC.trimDark, w, 4);
    s.block(x + 1, y + 1, R[0], w - 2, 2);
    s.block(x + 1, y + 1, R[3], left, 2);
    s.set(x + 1, y + 1, R[5]);
  });
}

/** a round shield of planks in an iron rim, r across, round (cx, cy) */
export function shield(s: S, cx: number, cy: number, r: number): void {
  fill(s, () => s.dot(cx, cy, r, BC.steel));
  fill(s, () => {
    s.dot(cx, cy, r - 1, ASH_LIGHT);
    for (let x = Math.round(cx - r + 2); x < cx + r - 1; x += 2) seg(s, x, cy - r + 2, x, cy + r - 2, ASH);
  });
  fill(s, () => s.dot(cx, cy, 1.2, BC.steelLight));
}

/** one half of a round shield split down its middle, its cut edge at x, r across round row cy, facing dir (-1 left) */
export function shieldHalf(s: S, x: number, cy: number, r: number, dir: number): void {
  const rim: Point[] = [];
  for (let a = -Math.PI / 2; a <= Math.PI / 2 + 0.01; a += Math.PI / 12)
    rim.push([x + dir * Math.cos(a) * r, cy + Math.sin(a) * r]);
  fill(s, () => {
    s.poly(rim, BC.steelLight);
    s.poly(
      rim.map(([px, py]) => [x + (px - x) * 0.72, cy + (py - cy) * 0.72] as const),
      ASH_LIGHT,
    );
    s.block(x + (dir < 0 ? -1 : 0), cy - 1, BC.steelGlint, 1, 2);
  });
}

/** an open palm, three fingers up and the thumb out to the right, twelve wide and ten tall, a bone cuff at its
 *  wrist */
const PALM = [
  ".LL.LL.LL...",
  ".ff.ff.ff...",
  ".ff.ff.ff...",
  ".ffffffff.LL",
  ".ffffffffff.",
  ".fffffffff..",
  ".ffffffff...",
  "..ffffff....",
  "..ffffff....",
  "..bbbbbb....",
] as const;
/** the palm, its top left at (x, y) */
export function palm(s: S, x: number, y: number, gold = false): void {
  fill(s, () => s.pixels(PALM, { f: BC.skin, L: BC.skinLight, b: gold ? GOLD : BC.trim }, x, y));
}

/** a raised fist seen from the front, nine wide and twelve tall: knuckles lit along its top, the thumb across, a bone
 *  bracer round the forearm below */
const FIST = [
  "..L.L.L..",
  ".LfLfLfL.",
  ".fffffff.",
  ".fdfdfdf.",
  ".fffffff.",
  ".TTTTfff.",
  "..fffff..",
  "..bbbbb..",
  "..fffff..",
  "..fffff..",
  "..fffff..",
  "..fffff..",
] as const;
/** the fist, its top left at (x, y) */
export function fist(s: S, x: number, y: number): void {
  fill(s, () => s.pixels(FIST, { f: BC.skin, L: BC.skinLight, d: BC.skinShade, T: BC.skinLight, b: BC.trim }, x, y));
}

/** a leather hide pegged out by its four legs, lit along its top, its middle at (cx, cy) */
export function hide(s: S, cx: number, cy: number, gold = false): void {
  fill(s, () => {
    s.poly(
      [
        [cx - 6, cy - 6],
        [cx - 3, cy - 4.5],
        [cx + 3, cy - 4.5],
        [cx + 6, cy - 6],
        [cx + 5, cy - 2],
        [cx + 5, cy + 3],
        [cx + 6, cy + 6],
        [cx + 3, cy + 4.5],
        [cx - 3, cy + 4.5],
        [cx - 6, cy + 6],
        [cx - 5, cy + 3],
        [cx - 5, cy - 2],
      ],
      BC.glove,
    );
    seg(s, cx - 3, cy - 4.5, cx + 3, cy - 4.5, BC.gloveLight);
    seg(s, cx - 5, cy - 2, cx - 5, cy + 3, BC.gloveLight);
  });
  fill(s, () => {
    for (const [x, y] of [
      [cx - 6, cy - 6],
      [cx + 5.5, cy - 6],
      [cx + 5.5, cy + 5.5],
      [cx - 6, cy + 5.5],
    ] as const)
      s.set(x, y, gold ? GOLD_LIGHT : BC.trim);
  });
}

/** a scar from (x0, y0) to (x1, y1), red and raised, with n stitches across it */
export function scar(s: S, x0: number, y0: number, x1: number, y1: number, n: number, stitch: Color): void {
  fill(s, () => seg(s, x0, y0, x1, y1, R[3]));
  fill(s, () => {
    const L = Math.hypot(x1 - x0, y1 - y0) || 1;
    const nx = -(y1 - y0) / L;
    const ny = (x1 - x0) / L;
    for (let i = 1; i <= n; i++) {
      const u = i / (n + 1);
      const mx = x0 + (x1 - x0) * u;
      const my = y0 + (y1 - y0) * u;
      seg(s, mx - nx * 1.2, my - ny * 1.2, mx + nx * 1.2, my + ny * 1.2, stitch);
    }
  });
}

/** the red wolf's head facing right, twelve wide and ten tall: ears pricked, a glowing eye, the jaws open on bone fangs */
const WOLF = [
  "...E..E.....",
  "..EE.EE.....",
  "..ELLLL.....",
  ".RLLLLLL....",
  "RRRRWRRRLL..",
  "RRRRRRRRRRRn",
  ".RRRRRRRRRR.",
  "..RRRRDDDDF.",
  "...RRRFDDD..",
  "....RRRR....",
] as const;
/** a small wolf's head for a pack, eight wide and six tall */
const SMALL_WOLF = [".E.E....", "EELLL...", "RRWRLLL.", "RRRRRRRn", ".RRRDDF.", "..RRR..."] as const;
const wolfColors = (gold: boolean): Record<string, Color> => ({
  E: gold ? GOLD : R[4],
  R: R[3],
  L: R[4],
  W: gold ? GOLD_LIGHT : R[5],
  n: R[1],
  D: R[0],
  F: gold ? GOLD_LIGHT : BC.trim,
});
/** the red wolf's head, its top left at (x, y) */
export function wolf(s: S, x: number, y: number, gold = false): void {
  fill(s, () => s.pixels(WOLF, wolfColors(gold), x, y));
}
/** a small red wolf's head, its top left at (x, y) */
export function smallWolf(s: S, x: number, y: number, gold = false): void {
  fill(s, () => s.pixels(SMALL_WOLF, wolfColors(gold), x, y));
}

/** a raven in flight facing right, twelve wide and nine tall: a wing raised over its back, a bone beak, a red eye */
const RAVEN_ROWS = [
  "......WW....",
  ".....WWW....",
  "....WWWW....",
  "...WWWW..BB.",
  "BB.WWWBBBBek",
  ".BBBBBBBBB.k",
  "..BBBBBBB...",
  "....BBB.....",
  "....t.t.....",
] as const;
/** a small raven, seven wide and five tall */
const SMALL_RAVEN = ["..WW...", "...WW..", "B..WBek", ".BBBBB.", "...t..."] as const;
const ravenColors = (gold: boolean): Record<string, Color> => ({
  W: gold ? GOLD : RAVEN_LIGHT,
  B: RAVEN,
  e: R[4],
  k: gold ? GOLD_LIGHT : BC.trim,
  t: BC.trimDark,
});
export function raven(s: S, x: number, y: number, gold = false): void {
  fill(s, () => s.pixels(RAVEN_ROWS, ravenColors(gold), x, y));
}
export function smallRaven(s: S, x: number, y: number, gold = false): void {
  fill(s, () => s.pixels(SMALL_RAVEN, ravenColors(gold), x, y));
}

/** a forebear's horned helm, eleven wide and eleven tall: bone horns curling up, a brow band, the hollow under it
 *  holding two glowing eyes either side of the nose guard, cheek guards, and the ghost trailing off below */
const HELM = [
  "H.........H",
  "HH.......HH",
  ".HH.PPP.HH.",
  "..HPPLPPH..",
  "..PPPPPPP..",
  "..BBBBBBB..",
  "..PeDNDeP..",
  "..PDDNDDP..",
  "..PD...DP..",
  "...g...g...",
  "..g..g..g..",
] as const;
/** a small helm for a host of forebears, seven wide and six tall */
const SMALL_HELM = ["H.....H", "HHPPPHH", ".PPLPP.", ".BBBBB.", ".PeNeP.", ".P...P."] as const;
const helmColors = (gold: boolean): Record<string, Color> => ({
  H: gold ? GOLD_LIGHT : BC.trim,
  L: gold ? GOLD_LIGHT : R[5],
  P: gold ? GOLD : GHOST,
  B: gold ? GOLD_DARK : R[3],
  e: gold ? GOLD_LIGHT : R[5],
  D: R[0],
  N: gold ? GOLD : GHOST,
  g: gold ? GOLD_DARK : R[3],
});
export function helm(s: S, x: number, y: number, gold = false): void {
  fill(s, () => s.pixels(HELM, helmColors(gold), x, y));
}
export function smallHelm(s: S, x: number, y: number, gold = false): void {
  fill(s, () => s.pixels(SMALL_HELM, helmColors(gold), x, y));
}

/** a pillar of blood rising from the floor at x to row top, w wide, drops thrown off its crown */
export function pillar(s: S, x: number, top: number, w: number, gold = false): void {
  fill(s, () => {
    s.poly(
      [
        [x - w / 2 - 1, 15],
        [x - w / 2, top + 2],
        [x + w / 2, top + 2],
        [x + w / 2 + 1, 15],
      ],
      R[3],
    );
    s.dot(x, top + 2, w / 2 + 0.6, R[3]);
    seg(s, x - w / 2 + 1, top + 2, x - w / 2 + 0.5, 14, R[5]);
  });
  fill(s, () => {
    s.set(x - w / 2 - 1.5, top, gold ? GOLD_LIGHT : R[4]);
    s.set(x + w / 2 + 1.5, top - 0.5, gold ? GOLD_LIGHT : R[4]);
    s.set(x, top - 1.5, gold ? GOLD_LIGHT : R[5]);
  });
}
