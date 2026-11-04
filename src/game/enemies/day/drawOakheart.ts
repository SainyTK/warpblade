import { SpriteCanvas } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import { mix, WHITE } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { game } from "../../state";
import { DAY_COLORS as DC } from "./colors";
import { OAK_TIMES } from "./oakheart";

const canvas = new SpriteCanvas(76, 62, 38, 54);
type Pt = readonly [number, number];
const B = DC.bark;
const L = DC.leaf;
/** the trunk, wider at the roots and the shoulders */
const TRUNK: readonly Pt[] = [
  [-10, -3],
  [-9, -12],
  [-10, -22],
  [-8, -28],
  [7, -28],
  [10, -22],
  [9, -12],
  [11, -3],
];
/** the crown: leaf clumps as x, y, radius, drawn back to front */
const CROWN: readonly (readonly [number, number, number])[] = [
  [-12, -31, 4.5],
  [12, -32, 4.5],
  [-6, -36, 5.5],
  [6, -37, 5.5],
  [-6, -30, 5],
  [6, -30, 5],
  [0, -34, 6],
];
/** acorns hanging in the crown */
const ACORNS: readonly Pt[] = [
  [-12, -28],
  [-2, -27],
  [12, -29],
];

/** where its two hands are for each move: back hand, front hand */
function hands(e: Enemy, step: number): [Pt, Pt] {
  switch (e.state) {
    case "wind":
      return [
        [-14, -14],
        [-8, -38],
      ];
    case "swipe":
      return [
        [-13, -12],
        [26, -12],
      ];
    case "charge":
      return [
        [-9, -42],
        [8, -43],
      ];
    case "burrow":
      return [
        [-14, -1],
        [16, -1],
      ];
    case "volley":
      return [
        [-16, -30],
        [16, -31],
      ];
    case "shoot":
      return [
        [-14, -26],
        [19, -36],
      ];
    default:
      return [
        [-13, -10 - step],
        [13, -10 + step],
      ];
  }
}

/** how hot the heart and eyes burn: a slow pulse, rising through any wind-up */
function heatOf(e: Enemy, t: number): number {
  const w = waveScale(game.wave).windup;
  if (e.state === "wind") return clamp(e.st / (OAK_TIMES.sweep * w));
  if (e.state === "charge") return clamp(e.st / (OAK_TIMES.root * w));
  if (e.state === "volley") return clamp(e.st / (OAK_TIMES.volley * w));
  if (e.state === "swipe" || e.state === "burrow" || e.state === "shoot") return 1;
  return 0.25 + Math.sin(t * 2 + e.seed) * 0.15;
}

function arm(s: SpriteCanvas, sx: number, sy: number, hand: Pt, lit: boolean): void {
  const [hx, hy] = hand;
  const mx = (sx + hx) / 2 + (hy < sy - 6 ? -2 : 1);
  const my = (sy + hy) / 2 + 1;
  s.stroke(sx, sy, mx, my, 2.6, lit ? B[2] : B[1]);
  s.stroke(mx, my, hx, hy, 2, lit ? B[2] : B[1]);
  // twig fingers spread from the hand
  const ax = Math.sign(hx - mx) || 1;
  const ay = Math.sign(hy - my) || 1;
  s.stroke(hx, hy, hx + ax * 3, hy - 2, 0.6, B[1]);
  s.stroke(hx, hy, hx + ax * 3, hy + ay * 2, 0.6, B[1]);
  s.stroke(hx, hy, hx + ax, hy + ay * 3, 0.6, B[1]);
  if (lit) {
    s.stroke(mx, my - 1.5, hx, hy - 1.5, 0.5, B[3]);
    s.set(sx + 1, sy - 2, B[4]);
  }
}

/** an old oak walking on its roots: a bark body lit from the right, a leafy crown with acorns, a violet heart crack and eyes */
export function drawOakheart(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const heat = heatOf(e, time);
  const step = e.state === "walk" ? Math.floor(time * 2.5) % 2 : 0;
  const drop = e.state === "burrow" ? 2 : e.state === "charge" ? -1 : 0;
  const shiver = e.state === "volley" ? (Math.floor(time * 24) % 2 ? 1 : -1) : 0;
  const [backHand, frontHand] = hands(e, step);
  const glowCol = heat > 0.75 ? DC.crackHot : mix(DC.crack, DC.crackHot, heat);
  s.clear();
  // the far root leg and the far branch arm, in shadow
  s.begin();
  s.stroke(-4, -8, -6 - step, 0, 3, B[1]);
  s.stroke(-6 - step, 0, -11 - step, 0, 1, B[1]);
  arm(s, -8, -20 + drop, backHand, false);
  s.commit();
  // the trunk
  s.begin();
  s.poly(
    TRUNK.map(([x, y]) => [x, y + drop] as const),
    B[2],
  );
  s.poly(
    [
      [4, -27 + drop],
      [8, -27 + drop],
      [10, -22 + drop],
      [8, -12 + drop],
      [10, -4 + drop],
      [6, -4 + drop],
      [6, -14 + drop],
    ],
    B[3],
  );
  for (let y = -26; y <= -5; y++) s.set(y > -22 && y < -12 ? 9 : 10, y + drop, B[4]);
  // bark grooves
  for (const [x, y0, y1] of [
    [-6, -26, -6],
    [-3, -22, -14],
    [5, -24, -18],
    [-7, -12, -4],
  ])
    for (let y = y0; y <= y1; y++) s.set(x + (Math.floor(y / 4) % 2), y + drop, B[1]);
  // moss on its shoulders and roots
  for (const [x, y] of [
    [-8, -27],
    [-7, -27],
    [-9, -26],
    [-6, -28],
    [-9, -4],
    [-8, -3],
  ])
    s.set(x, y + drop, DC.moss);
  // the face: a heavy brow over two sunken, lit eyes
  s.stroke(0, -24 + drop, 9, -23 + drop, 0.8, B[1]);
  s.set(1, -25 + drop, B[4]);
  for (const x of [1, 5]) {
    s.set(x, -22 + drop, DC.outline);
    s.set(x + 1, -22 + drop, DC.outline);
    s.set(x, -22 + drop, heat > 0.5 ? WHITE : DC.eye);
    s.set(x + 1, -22 + drop, heat > 0.5 ? DC.crackHot : DC.crack);
  }
  // the knothole in its chest, and the violet heart that burns in it before each blow
  s.dot(2, -13 + drop, 3.2, B[0]);
  s.dot(2.5, -12.5 + drop, 2.1, glowCol);
  s.dot(2.5, -12.5 + drop, 1, heat > 0.6 ? WHITE : DC.crackHot);
  for (let a = -2.6; a < -0.6; a += 0.35) s.set(2 + Math.cos(a) * 3.6, -13 + drop + Math.sin(a) * 3.6, B[4]);
  s.commit();
  // the leafy crown, shaking before it throws
  s.begin();
  const cy = drop + (e.state === "charge" ? -1 : 0);
  for (const [x, y, r] of CROWN) s.dot(x + shiver, y + cy, r, L[1]);
  for (const [x, y, r] of CROWN) s.dot(x + shiver + 1, y + cy - 1, r - 2, L[2]);
  for (const [x, y, r] of CROWN) {
    s.dot(x + shiver + 2, y + cy - 2, r - 3.6, L[3]);
    s.set(x + shiver + 2, y + cy - r + 1, L[4]);
  }
  for (const [x, y] of [
    [-14, -30],
    [-3, -32],
    [8, -34],
    [-8, -38],
    [3, -28],
  ])
    s.set(x + shiver, y + cy, L[0]);
  if (e.state !== "shoot")
    for (const [x, y] of ACORNS) {
      s.set(x + shiver, y + cy, DC.acornCap);
      s.set(x + shiver, y + cy + 1, DC.acorn);
      s.set(x + shiver + 1, y + cy + 1, DC.acornLit);
    }
  s.commit();
  // the near root leg and the near arm, lit
  s.begin();
  s.stroke(4, -8, 5 + step, 0, 3.2, B[2]);
  s.stroke(5 + step, -6, 6 + step, -1, 0.6, B[3]);
  s.stroke(5 + step, 0, 11 + step, 0, 1, B[2]);
  s.stroke(4 + step, 0, 1 + step, 0, 1, B[2]);
  arm(s, 9, -19 + drop, frontHand, true);
  s.commit();
  s.outline(DC.outline);
  return s;
}
