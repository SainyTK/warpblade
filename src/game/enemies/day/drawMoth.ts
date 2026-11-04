import { SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";
import type { Enemy } from "../../../types/enemy";
import { scale, WHITE } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { game } from "../../state";
import { DAY_COLORS as DC } from "./colors";

const canvas = new SpriteCanvas(40, 38, 20, 20);
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

/** one wing: dark root, warm body, a pale leading edge and a violet eye spot that burns hot while it winds up */
function wing(s: SpriteCanvas, w: Wing, shape: readonly Pt[], dim: number, heat: number, spotAt: number): void {
  const c = (col: Color) => (dim < 1 ? scale(col, dim) : col);
  s.poly(
    shape.map(([u, v]) => at(w, u, v)),
    c(W[2]),
  );
  s.poly(
    shape.map(([u, v]) => at(w, u * 0.32, v * 0.6)),
    c(W[1]),
  );
  const fore = shape === FORE;
  const tip = fore ? 12.5 : 7.5;
  // a dark vein down the middle of the wing and a dark band along its trailing edge
  for (let u = 1; u <= tip - 2; u += 0.5) {
    const [x, y] = at(w, u, fore ? -u * 0.12 : 0);
    s.set(x, y, c(W[1]));
  }
  for (let i = fore ? 4 : 3; i < shape.length - 1; i++) {
    const [u0, v0] = shape[i];
    const [u1, v1] = shape[i + 1];
    for (let k = 0; k <= 1; k += 0.25) {
      const [x, y] = at(w, u0 + (u1 - u0) * k - 0.5, v0 + (v1 - v0) * k - 0.6);
      s.set(x, y, c(W[0]));
    }
  }
  // the lit leading edge, palest at the tip
  for (let u = 2; u <= tip; u += 0.5) {
    const [x, y] = at(w, u, fore ? -2.4 - u * 0.2 : -2.6 * Math.sin((u / (tip + 1)) * Math.PI) - 0.4);
    s.set(x, y, c(u > tip - 3 ? W[4] : W[3]));
  }
  if (spotAt > 0) {
    const [x, y] = at(w, spotAt, 0);
    s.dot(x, y, 1.6, c(DC.wingSpot));
    s.set(x, y, heat > 0.6 ? WHITE : c(heat > 0.2 ? DC.crackHot : DC.crack));
  }
}

/** how hot its wings glow: faint while it drifts, rising through the wind-up, white as it sheds */
function heatOf(e: Enemy): number {
  if (e.state === "wind") return clamp(e.st / (0.5 * waveScale(game.wave).windup));
  if (e.state === "shoot") return 1;
  return 0;
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
  s.begin();
  wing(s, { x: -1, y: -1 + bob, a: fore + 0.35 }, FORE, 0.62, heat, 0);
  wing(s, { x: -2, y: 0 + bob, a: fore - 0.4 }, HIND, 0.55, heat, 0);
  s.commit();
  // the furred body: abdomen, thorax, collar, head and feelers
  s.begin();
  s.stroke(-2, 1 + bob, -7, 3 + bob, 2.1, B[1]);
  for (const x of [-3, -5]) s.stroke(x, -0.5 + bob, x - 0.5, 3.5 + bob, 0.45, B[0]);
  s.set(-8, 3 + bob, B[2]);
  s.dot(1.5, 0 + bob, 2.7, B[2]);
  s.dot(1, -1 + bob, 1.5, B[3]);
  s.dot(4.5, -0.5 + bob, 1.9, B[1]);
  s.set(3, -2 + bob, DC.pollen[2]);
  s.set(2, -2.5 + bob, DC.pollen[3]);
  s.set(5, -1 + bob, heat > 0.3 ? WHITE : DC.eye);
  s.stroke(5, -2 + bob, 8, -6 + bob, 0.45, B[3]);
  s.stroke(4, -2 + bob, 5.5, -6.5 + bob, 0.45, B[3]);
  s.set(8, -7 + bob, W[3]);
  s.set(6, -7 + bob, W[3]);
  for (const x of [0, 2]) s.set(x, 3 + bob, B[0]);
  s.commit();
  // the near pair, in front, lit
  s.begin();
  wing(s, { x: 0, y: -1 + bob, a: fore - 0.7 }, HIND, 1, heat, 4.5);
  wing(s, { x: 0, y: -1 + bob, a: fore }, FORE, 1, heat, 7.5);
  s.commit();
  s.outline(DC.outline);
  return s;
}
