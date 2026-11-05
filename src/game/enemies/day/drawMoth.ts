import { detailCanvas, type SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";
import type { Enemy } from "../../../types/enemy";
import { scale, WHITE } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { clamp } from "../../../utils/math";
import { pointInPolygon } from "../../../utils/pointInPolygon";
import { waveScale } from "../../../utils/progression";
import { game } from "../../state";
import { DAY_COLORS as DC } from "./colors";
import { glowEye } from "./paint";

const canvas = detailCanvas(40, 38, 20, 20);
type Pt = readonly [number, number];
/** a forewing and a hindwing outline, along the wing from its root (u) and across it (v) */
const FORE: readonly Pt[] = [
  [0, -1],
  [5, -3],
  [10.5, -5],
  [13.5, -4],
  [12.5, -0.5],
  [10, 2.5],
  [7, 2],
  [5, 3.5],
  [2, 2],
];
const HIND: readonly Pt[] = [
  [0, -1],
  [4, -3],
  [7.5, -2],
  [8, 1.5],
  [4, 3],
];
/** where each wing's veins run to from the root */
const FORE_VEINS: readonly Pt[] = [
  [10, -3.6],
  [11.2, -0.8],
  [9, 1.6],
  [5.5, 2.2],
];
const HIND_VEINS: readonly Pt[] = [
  [6.6, -1.4],
  [6.8, 1],
  [3.8, 2.2],
];
const W = DC.wing;
const B = DC.mothBody;

interface Wing {
  x: number;
  y: number;
  a: number;
}

const at = (w: Wing, u: number, v: number): Pt => [
  w.x + u * Math.cos(w.a) - v * Math.sin(w.a),
  w.y + u * Math.sin(w.a) + v * Math.cos(w.a),
];

/** a fine line across the wing from one (u, v) point to another, one image pixel wide */
function vein(s: SpriteCanvas, w: Wing, u0: number, v0: number, u1: number, v1: number, c: Color): void {
  const n = Math.ceil(Math.hypot(u1 - u0, v1 - v0) * 2 * s.res);
  for (let i = 0; i <= n; i++) {
    const [x, y] = at(w, u0 + ((u1 - u0) * i) / n, v0 + ((v1 - v0) * i) / n);
    s.set(x, y, c);
  }
}

/** the near wings' texture: the root fades out in scattered dark scales, the membrane carries pale ones, veins fan out */
function dust(s: SpriteCanvas, w: Wing, shape: readonly Pt[], tip: number): void {
  const fore = shape === FORE;
  for (let u = 1; u < tip + 1; u += 0.5)
    for (let v = -5; v <= 3.5; v += 0.5) {
      if (!pointInPolygon(shape, u, v)) {
        continue;
      }
      const g = grain(u * 2 + (fore ? 0 : 40), v * 2);
      const [x, y] = at(w, u, v);
      if (u < tip * 0.5 && g < 0.5 - u / tip) {
        s.set(x, y, W[1]);
      } else if (u > tip * 0.4 && g > 0.95) {
        s.set(x, y, DC.wingScale);
      }
    }
  for (const [u, v] of fore ? FORE_VEINS : HIND_VEINS) {
    vein(s, w, 0.8, 0, u, v, W[1]);
  }
}

/**
 * One wing: a dusty amber membrane lit along its leading edge, a dark root, fine veins, a scalloped dark trailing band
 * and, on the near pair, a violet eye spot that burns hot while it winds up. The far pair is a shade dimmer.
 */
function wing(s: SpriteCanvas, w: Wing, shape: readonly Pt[], dim: number, heat: number, spotAt: number): void {
  const c = (col: Color) => (dim < 1 ? scale(col, dim) : col);
  const fore = shape === FORE;
  const tip = fore ? 12.5 : 7.5;
  s.begin();
  s.poly(
    shape.map(([u, v]) => at(w, u, v)),
    c(W[2]),
  );
  s.shadeEdges(c(W[2]), c(W[3]), c(W[2]));
  s.poly(
    shape.map(([u, v]) => at(w, u * 0.32, v * 0.6)),
    c(W[1]),
  );
  for (let i = fore ? 4 : 3; i < shape.length - 1; i++) {
    const [u0, v0] = shape[i];
    const [u1, v1] = shape[i + 1];
    vein(s, w, u0 - 0.4, v0 - 0.5, u1 - 0.4, v1 - 0.5, c(W[0]));
  }
  const near = dim >= 1;
  if (near) {
    dust(s, w, shape, tip);
  }
  // the lit leading edge, palest at the tip, with a glint on the near pair
  for (let u = 2; u <= tip; u += 0.5) {
    const v = fore ? -2.4 - u * 0.2 : -2.6 * Math.sin((u / (tip + 1)) * Math.PI) - 0.4;
    const [x, y] = at(w, u, v);
    s.dot(x, y, 0.4, c(u > tip - 3 ? W[4] : W[3]));
  }
  if (near) {
    const [gx, gy] = at(w, tip - 1, fore ? -4.6 : -1.4);
    s.set(gx, gy, WHITE);
  }
  if (spotAt > 0) {
    const [x, y] = at(w, spotAt, 0);
    s.dot(x, y, 1.9, W[0]);
    s.dot(x, y, 1.4, DC.wingSpot);
    const hot = heat > 0.6;
    s.dot(x, y, 0.8, hot ? DC.crackHot : heat > 0.2 ? DC.crack : DC.crackDeep);
    glowEye(s, x - 0.5, y - 0.5, hot ? WHITE : heat > 0.2 ? DC.crackHot : DC.crack, hot ? WHITE : DC.crackHot);
  }
  s.commit();
}

/** how hot its wings glow: faint while it drifts, rising through the wind-up, white as it sheds */
function heatOf(e: Enemy): number {
  if (e.state === "wind") {
    return clamp(e.st / (0.5 * waveScale(game.wave).windup));
  }
  if (e.state === "shoot") {
    return 1;
  }
  return 0;
}

/** a feathered feeler from its root to its tip, with fine barbs down both sides */
function feeler(s: SpriteCanvas, x0: number, y0: number, x1: number, y1: number): void {
  s.stroke(x0, y0, x1, y1, 0.3, B[3]);
  for (let k = 0.3; k < 0.95; k += 0.17) {
    const x = x0 + (x1 - x0) * k;
    const y = y0 + (y1 - y0) * k;
    s.set(x - 0.5, y, B[2]);
    s.set(x + 0.5, y + 0.5, B[2]);
  }
  s.block(x1 - 0.5, y1 - 0.5, W[3]);
  s.set(x1 - 0.5, y1 - 0.5, W[4]);
}

/** a Glimmer Moth: a furred violet body, amber wings with violet eyes, feathered feelers; wings beat faster to wind up */
export function drawMoth(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const heat = heatOf(e);
  const tired = e.state === "recover";
  const rate = e.state === "wind" ? 30 : tired ? 9 : 16;
  const f = e.state === "shoot" ? -1 : Math.sin(time * rate);
  const fore = -2.25 + f * 0.75;
  const bob = Math.round(f * 0.6);
  s.clear();
  // the far pair, darker, behind the body
  wing(s, { x: -1, y: -1 + bob, a: fore + 0.35 }, FORE, 0.62, heat, 0);
  wing(s, { x: -2, y: 0 + bob, a: fore - 0.4 }, HIND, 0.55, heat, 0);
  // the banded abdomen and its thin legs
  s.begin();
  s.stroke(-2, 1 + bob, -7, 3 + bob, 2.1, B[1]);
  s.shadeEdges(B[1], B[2], B[0], 2);
  for (const x of [-3.4, -5, -6.6]) {
    s.stroke(x + 0.4, -0.2 + bob, x - 0.2, 3.6 + bob, 0.25, B[0]);
  }
  s.block(-8.5, 2.5 + bob, B[2]);
  s.stroke(0, 2.5 + bob, -0.5, 4 + bob, 0.25, B[0]);
  s.stroke(2, 2.5 + bob, 2.6, 4 + bob, 0.25, B[0]);
  s.commit();
  // the furred thorax under a collar of pollen
  s.begin();
  s.dot(1.5, 0 + bob, 2.7, B[2]);
  s.shadeEdges(B[2], B[3], B[1], 2);
  for (const [x, y] of [
    [0, -1],
    [1.5, 0.5],
    [-0.5, 1],
    [2.5, -1.5],
    [1, 1.5],
  ])
    s.set(x, y + bob, DC.mothFurLit);
  s.block(2.5, -2.5 + bob, DC.pollen[2]);
  s.block(1.5, -3 + bob, DC.pollen[1]);
  s.set(1.5, -3 + bob, DC.pollen[3]);
  s.set(2.5, -2.5 + bob, DC.pollen[3]);
  s.commit();
  // the head with its glowing eye, and the feathered feelers
  s.begin();
  s.dot(4.5, -0.5 + bob, 1.9, B[1]);
  s.shadeEdges(B[1], B[2], B[0]);
  glowEye(s, 4.5, -1.5 + bob, heat > 0.3 ? WHITE : DC.eye, WHITE);
  if (heat > 0.3) {
    s.set(5.5, -1 + bob, DC.crackHot);
  }
  s.commit();
  s.begin();
  feeler(s, 5, -2 + bob, 8, -6.5 + bob);
  feeler(s, 4, -2 + bob, 5.5, -7 + bob);
  s.commit();
  // the near pair, in front, lit
  wing(s, { x: 0, y: -1 + bob, a: fore - 0.7 }, HIND, 1, heat, 4.5);
  wing(s, { x: 0, y: -1 + bob, a: fore }, FORE, 1, heat, 7.5);
  s.outline(DC.outline);
  return s;
}
