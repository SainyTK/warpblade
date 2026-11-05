import { detailCanvas, type SpriteCanvas } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import { mix, WHITE } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { game } from "../../state";
import { DAY_COLORS as DC } from "./colors";
import { OAK_TIMES } from "./oakheart";
import { block, glowEye, grain, inside } from "./paint";

const canvas = detailCanvas(76, 62, 38, 54);
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
/** bark grooves running down the trunk: x, top, bottom */
const GROOVES: readonly (readonly [number, number, number])[] = [
  [-6, -26, -6],
  [-3, -22, -15],
  [5, -24, -17],
  [-7, -12, -4],
  [7, -14, -5],
  [-1, -8, -4],
];
/** moss clinging to its shoulders and roots: x, y, radius */
const MOSS: readonly (readonly [number, number, number])[] = [
  [-7.5, -27.5, 1.6],
  [-5, -28, 1.1],
  [-9.2, -25.5, 1],
  [-8.8, -4.2, 1],
  [-7.6, -3.2, 0.7],
  [8.6, -21, 0.9],
];
/** rift veins spreading from the heart: points from the knothole outward */
const VEINS: readonly (readonly Pt[])[] = [
  [
    [-1, -14],
    [-3, -16],
    [-3.5, -18.5],
  ],
  [
    [5.5, -11.5],
    [7, -9.5],
    [6.5, -7],
  ],
  [
    [0.5, -10],
    [-0.5, -8],
  ],
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
  if (e.state === "wind") {
    return clamp(e.st / (OAK_TIMES.sweep * w));
  }
  if (e.state === "charge") {
    return clamp(e.st / (OAK_TIMES.root * w));
  }
  if (e.state === "volley") {
    return clamp(e.st / (OAK_TIMES.volley * w));
  }
  if (e.state === "swipe" || e.state === "burrow" || e.state === "shoot") {
    return 1;
  }
  return 0.25 + Math.sin(t * 2 + e.seed) * 0.15;
}

/** a branch arm from the shoulder to a hand of twig fingers, lit on top; the far arm a shade darker */
function arm(s: SpriteCanvas, sx: number, sy: number, hand: Pt, lit: boolean): void {
  const [hx, hy] = hand;
  const mx = (sx + hx) / 2 + (hy < sy - 6 ? -2 : 1);
  const my = (sy + hy) / 2 + 1;
  const bark = lit ? B[2] : B[1];
  const ax = Math.sign(hx - mx) || 1;
  const ay = Math.sign(hy - my) || 1;
  s.begin();
  s.stroke(sx, sy, mx, my, 2.6, bark);
  s.stroke(mx, my, hx, hy, 2, bark);
  s.stroke(hx, hy, hx + ax * 3, hy - 2, 0.6, bark);
  s.stroke(hx, hy, hx + ax * 3, hy + ay * 2, 0.6, bark);
  s.stroke(hx, hy, hx + ax, hy + ay * 3, 0.6, bark);
  s.shadeEdges(bark, lit ? B[3] : B[2], lit ? B[1] : B[0], 2);
  // grain along the branch, and a knot at the elbow
  const grainLine = (x0: number, y0: number, x1: number, y1: number, off: number) => {
    for (let k = 0.2; k < 0.8; k += 0.05) {
      s.set(x0 + (x1 - x0) * k, y0 + (y1 - y0) * k + off, lit ? B[1] : B[0]);
    }
  };
  grainLine(sx, sy, mx, my, 0.6);
  grainLine(mx, my, hx, hy, 0.4);
  block(s, mx - 0.5, my - 0.5, B[0]);
  s.set(mx - 0.5, my - 1, lit ? B[4] : B[3]);
  if (lit) {
    s.set(sx, sy - 2, DC.barkGlint);
    s.set(sx + 0.5, sy - 2, DC.barkGlint);
  }
  s.commit();
}

/** a root leg from the trunk to a foot of roots splayed on the ground */
function root(s: SpriteCanvas, x0: number, x1: number, step: number, lit: boolean): void {
  const bark = lit ? B[2] : B[1];
  s.begin();
  s.stroke(x0, -8, x1 + step, 0, lit ? 3.2 : 3, bark);
  s.stroke(x1 + step, 0, x1 + step + (lit ? 6 : -5), 0, 1, bark);
  if (lit) {
    s.stroke(x1 - 1 + step, 0, x1 - 4 + step, 0, 1, bark);
  }
  s.shadeEdges(bark, lit ? B[3] : B[2], lit ? B[1] : B[0], 2);
  for (const k of [0.3, 0.65]) {
    s.set(x0 + (x1 + step - x0) * k, -8 + 8 * k, B[0]);
  }
  if (lit) {
    s.stroke(x1 + step, -6, x1 + 1 + step, -1, 0.3, B[3]);
  }
  s.commit();
}

/** an old oak walking on its roots: a bark body lit from the top left, a leafy crown with acorns, a violet heart and eyes */
export function drawOakheart(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const heat = heatOf(e, time);
  const step = e.state === "walk" ? Math.floor(time * 2.5) % 2 : 0;
  const drop = e.state === "burrow" ? 2 : e.state === "charge" ? -1 : 0;
  const shiver = e.state === "volley" ? (Math.floor(time * 24) % 2 ? 1 : -1) : 0;
  const [backHand, frontHand] = hands(e, step);
  const glowCol = heat > 0.75 ? DC.crackHot : mix(DC.crack, DC.crackHot, heat);
  const hot = heat > 0.5;
  s.clear();
  // the far root leg and the far branch arm, in shadow
  root(s, -4, -6, -step, false);
  arm(s, -8, -20 + drop, backHand, false);
  // the trunk: bark lit down its left side, deep grooves with lit ridges, moss on the shoulders and roots
  const trunk = TRUNK.map(([x, y]) => [x, y + drop] as const);
  s.begin();
  s.poly(trunk, B[2]);
  s.shadeEdges(B[2], B[3], B[1], 4);
  for (const [x, y0, y1] of GROOVES)
    for (let y = y0; y <= y1; y += 0.5) {
      const gx = x + Math.sin(y * 0.7 + x) * 0.6;
      if (!inside(TRUNK, gx, y)) {
        continue;
      }
      s.set(gx, y + drop, B[0]);
      s.set(gx + 0.5, y + drop, B[1]);
      s.set(gx - 0.5, y + drop, B[3]);
    }
  for (let y = -27; y <= -4; y += 1)
    for (let x = -8; x <= 9; x += 1) {
      const g = grain(x, y);
      if (g > 0.08 || !inside(TRUNK, x, y)) {
        continue;
      }
      s.set(x, y + drop, B[1]);
      s.set(x, y + 0.5 + drop, B[1]);
    }
  s.set(-8.5, -26 + drop, DC.barkGlint);
  s.set(-8.5, -25.5 + drop, DC.barkGlint);
  s.commit();
  s.begin();
  for (const [x, y, r] of MOSS) {
    s.dot(x, y + drop, r, DC.moss);
  }
  s.shadeEdges(DC.moss, DC.mossLit, DC.mossDark);
  s.commit();
  // the face: a heavy brow over two sunken eyes with hot cores
  s.begin();
  s.stroke(0, -24 + drop, 9, -23 + drop, 0.8, B[1]);
  s.stroke(0.5, -24.6 + drop, 8.5, -23.8 + drop, 0.25, B[3]);
  s.set(0.5, -25 + drop, B[4]);
  s.commit();
  s.begin();
  for (const x of [1, 5]) {
    s.stroke(x + 0.2, -21.6 + drop, x + 1.8, -21.6 + drop, 0.75, B[0]);
    glowEye(s, x, -22 + drop, hot ? DC.crackHot : DC.eye, WHITE);
    block(s, x + 1, -22 + drop, hot ? DC.crackHot : DC.crack);
    if (!hot) {
      s.set(x + 1.5, -21.5 + drop, DC.crackDeep);
    }
  }
  s.commit();
  // the knothole in its chest, lit on its rim, and the violet heart that burns in it before each blow
  s.begin();
  s.dot(2, -13 + drop, 3.6, B[3]);
  s.shadeEdges(B[3], B[4], B[1], 2);
  s.dot(2.2, -12.8 + drop, 2.9, DC.barkDeep);
  s.dot(2.5, -12.5 + drop, 2.1, glowCol);
  s.dot(2.5, -12.5 + drop, 1.3, hot ? DC.crackHot : DC.crack);
  block(s, 2, -13 + drop, heat > 0.6 ? WHITE : DC.crackHot);
  s.set(2, -13 + drop, WHITE);
  s.commit();
  s.begin();
  for (const vein of VEINS)
    for (let i = 1; i < vein.length; i++) {
      const [x0, y0] = vein[i - 1];
      const [x1, y1] = vein[i];
      s.stroke(x0, y0 + drop, x1, y1 + drop, 0.25, hot ? DC.crackHot : DC.crack);
    }
  s.commit(false);
  // the leafy crown, clump by clump, shaking before it throws
  const cy = drop + (e.state === "charge" ? -1 : 0);
  s.begin();
  for (const [x, y, r] of CROWN) {
    s.dot(x + shiver + 0.5, y + cy + 0.5, r + 0.5, DC.leafDeep);
  }
  s.commit();
  for (const [x, y, r] of CROWN) {
    const lx = x + shiver;
    const ly = y + cy;
    s.begin();
    s.dot(lx, ly, r, L[2]);
    for (let a = 0; a < 6.2; a += 0.8)
      s.dot(lx + Math.cos(a + x) * r * 0.95, ly + Math.sin(a + x) * r * 0.95, 1.2, L[2]);
    s.shadeEdges(L[2], L[3], L[1], 3);
    s.dot(lx - r * 0.3, ly - r * 0.3, r * 0.45, L[3]);
    for (let j = -r; j <= r; j += 1)
      for (let i = -r; i <= r; i += 1) {
        const g = grain(x + i, y + j);
        if (i * i + j * j > (r - 0.5) * (r - 0.5) || g < 0.68) {
          continue;
        }
        const sunlit = i + j < -r * 0.4;
        const leafCol = sunlit ? (g > 0.85 ? L[4] : L[2]) : L[1];
        s.set(lx + i, ly + j, leafCol);
        s.set(lx + i + 0.5, ly + j - 0.5, leafCol);
        s.set(lx + i + 0.5, ly + j, leafCol);
      }
    s.commit();
  }
  if (e.state !== "shoot") {
    s.begin();
    for (const [x, y] of ACORNS) {
      const ax = x + shiver;
      const ay = y + cy;
      s.dot(ax + 0.5, ay + 1.6, 1.1, DC.acorn);
      s.shadeEdges(DC.acorn, DC.acornLit, DC.acornShade);
      s.set(ax + 0.5, ay + 3, DC.acornShade);
      s.stroke(ax - 0.4, ay + 0.4, ax + 1.4, ay + 0.4, 0.6, DC.acornCap);
      s.set(ax - 0.5, ay, DC.acornCapLit);
      s.set(ax, ay, DC.acornCapLit);
      s.set(ax + 0.5, ay - 0.5, DC.acornCap);
    }
    s.commit();
  }
  // the near root leg and the near arm, lit
  root(s, 4, 5, step, true);
  arm(s, 9, -19 + drop, frontHand, true);
  s.outline(DC.outline);
  return s;
}
