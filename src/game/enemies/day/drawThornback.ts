import { detailCanvas, type SpriteCanvas } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import { WHITE } from "../../../utils/color";
import { DAY_COLORS as DC } from "./colors";
import { block, glowEye, grain } from "./paint";

const canvas = detailCanvas(54, 38, 27, 34);
const H = DC.hide;
const B = DC.bramble;
type Pt = readonly [number, number];
/** the thorny hump along its back: x, height of the back there, thorn length */
const SPINES: readonly (readonly [number, number, number])[] = [
  [-11, -11, 2],
  [-8, -13, 3],
  [-5, -15, 4],
  [-2, -16, 5],
  [1, -16, 5],
  [4, -15, 4],
  [7, -13, 3],
];
/** the body's three masses, rump to shoulder: x, y, radius */
const BODY: readonly (readonly [number, number, number])[] = [
  [-8, -8, 4.5],
  [-3, -9, 6.5],
  [4, -9.5, 6],
];
/** the bramble vines wrapped round the body: from, bend, to */
const VINES: readonly (readonly [Pt, Pt, Pt])[] = [
  [
    [-10, -12],
    [-8.2, -7.6],
    [-4, -4],
  ],
  [
    [-2, -15],
    [0.4, -9],
    [4, -4],
  ],
  [
    [5, -14],
    [7.6, -11],
    [9, -7],
  ],
];
/** leaves sprouting from the vines */
const LEAVES: readonly Pt[] = [
  [-9.5, -10],
  [-6.5, -7],
  [-0.5, -12],
  [2, -8],
  [6, -12.5],
];
/** the rift crack down its flank, top to bottom */
const CRACK: readonly Pt[] = [
  [-4.2, -12.4],
  [-3.6, -10.8],
  [-2.8, -9.6],
  [-3, -8.4],
  [-2, -7.2],
  [-1.2, -6],
];

/** whether a local point lies inside the body's masses, inset by this margin */
const inBody = (x: number, y: number, margin: number): boolean =>
  BODY.some(([cx, cy, r]) => Math.hypot(x - cx, y - cy) < r - margin);

/** a leg from hip to hoof: a shaded column and a split hoof */
function leg(s: SpriteCanvas, hx: number, hy: number, fx: number, fy: number, near: boolean): void {
  const hide = near ? H[2] : H[0];
  s.begin();
  s.stroke(hx, hy, (hx + fx) / 2, (hy + fy) / 2 - 0.5, near ? 1.7 : 1.5, hide);
  s.stroke((hx + fx) / 2, (hy + fy) / 2 - 0.5, fx, fy - 1, near ? 1.25 : 1.1, hide);
  s.shadeEdges(hide, near ? DC.hideLit : H[1], near ? H[1] : DC.hideDeep, 2);
  s.commit();
  s.begin();
  s.poly(
    [
      [fx - 1.1, fy - 1.4],
      [fx + 1.1, fy - 1.4],
      [fx + 1.5, fy + 0.5],
      [fx - 1.3, fy + 0.5],
    ],
    near ? DC.hoof : DC.hideDeep,
  );
  if (near) {
    s.shadeEdges(DC.hoof, DC.hoofLit, DC.hideDeep);
  }
  s.set(fx + 0.5, fy, DC.hideDeep);
  s.commit();
}

/** one thorn of the hump, tapered from its root to a pale tip with a lit edge */
function thorn(s: SpriteCanvas, x0: number, y0: number, x1: number, y1: number): void {
  const len = Math.hypot(x1 - x0, y1 - y0) || 1;
  const nx = (y0 - y1) / len;
  const ny = (x1 - x0) / len;
  s.poly(
    [
      [x0 - nx * 1.1, y0 - ny * 1.1],
      [x1, y1],
      [x0 + nx * 1.1, y0 + ny * 1.1],
    ],
    B[2],
  );
  for (let u = 0.45; u < 0.95; u += 0.12) {
    const w = (1 - u) * 0.9 - 0.25;
    s.set(x0 + (x1 - x0) * u + nx * w, y0 + (y1 - y0) * u + ny * w, DC.thorn);
  }
  s.set(x1, y1, DC.thornTip);
  s.set(x1 + (x0 - x1) / len / 2, y1 + (y0 - y1) / len / 2, DC.thornTip);
}

/** a bramble boar: a hide wrapped in thorny vines, a hump of thorns, tusks, and a violet rift crack down its flank */
export function drawThornback(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const charging = e.state === "lunge";
  const winding = e.state === "wind";
  const winded = e.state === "recover";
  const gait = charging ? Math.floor(time * 14) % 4 : e.state === "walk" ? Math.floor(time * 6) % 2 : 0;
  const step = charging ? [-2, -1, 2, 1][gait] : gait ? 1 : -1;
  const drop = winding || charging ? 2 : winded ? 1 : 0;
  const sag = winded ? 1 + (Math.floor(time * 3) % 2) : 0;
  const paw = winding ? Math.sin(e.st * 22) * 2.5 : 0;
  const lift = charging ? -1 : 0;
  const by = lift + sag;
  s.clear();
  // the far legs, in shadow
  leg(s, -8, -6 + sag, -8 - step, 0, false);
  leg(s, 6, -6 + sag, 6 + step, 0, false);
  // the body: a hide lit across the back, a dark belly and coarse hair combed back
  s.begin();
  for (const [x, y, r] of BODY) {
    s.dot(x, y + by, r, H[1]);
  }
  s.shadeEdges(H[1], H[2], H[0], 3);
  s.dot(-3, -11 + by, 4.6, H[2]);
  s.dot(4, -12 + by, 3.6, H[2]);
  s.shadeEdges(H[2], DC.hideLit, H[2]);
  s.stroke(-6, -3.8 + by, 5, -3.8 + by, 0.6, H[0]);
  for (let y = -15; y <= -5; y += 1.5)
    for (let x = -12; x <= 9; x += 1.5) {
      const jx = x + grain(x, y) * 0.8;
      if (grain(y, x) < 0.55 || !inBody(jx, y, 1.2)) {
        continue;
      }
      const hair = y < -9 ? H[1] : H[0];
      s.set(jx, y + by, hair);
      s.set(jx - 0.5, y + 0.5 + by, hair);
    }
  s.set(-4, -15 + by, DC.hideGlint);
  s.set(-3.5, -15 + by, DC.hideGlint);
  s.commit();
  // the bramble vines wrapped round it, with leaves
  s.begin();
  for (const [a, m, b] of VINES) {
    s.stroke(a[0], a[1] + by, m[0], m[1] + by, 0.6, B[1]);
    s.stroke(m[0], m[1] + by, b[0], b[1] + by, 0.6, B[1]);
  }
  s.shadeEdges(B[1], B[2], B[0]);
  for (const [x, y] of LEAVES) {
    block(s, x - 0.5, y - 0.5 + by, B[3], 1.5);
    s.set(x - 0.5, y - 0.5 + by, DC.brambleLit);
    s.set(x, y - 0.5 + by, DC.brambleLit);
    s.set(x + 0.5, y + 0.5 + by, B[2]);
  }
  s.commit();
  // the rift crack on its flank, glowing white hot while it winds up
  s.begin();
  for (let i = 1; i < CRACK.length; i++)
    s.stroke(CRACK[i - 1][0], CRACK[i - 1][1] + by, CRACK[i][0], CRACK[i][1] + by, 0.5, DC.crack);
  for (let i = 1; i < CRACK.length - 1; i++) {
    s.set(CRACK[i][0], CRACK[i][1] + by, winding ? WHITE : DC.crackHot);
  }
  s.set(-2.6, -9.2 + by, DC.crackHot);
  s.commit();
  // the hump of thorns, raised when it means to charge
  s.begin();
  const bristle = winding ? 1 : charging ? -1 : 0;
  for (const [x, y, L] of SPINES) {
    const len = L + bristle;
    thorn(s, x, y + by + 1, x - len * (charging ? 0.9 : 0.45), y - len + by);
  }
  s.commit();
  // the head, lowered to charge: a long snout, a pricked ear, a brow over a burning eye
  const hy = drop + by;
  s.begin();
  s.dot(10, -8 + hy, 4, H[2]);
  s.stroke(11, -7 + hy, 15.5, -5 + hy, 2.3, H[2]);
  s.shadeEdges(H[2], DC.hideLit, H[1], 3);
  s.stroke(8.5, -4.6 + hy, 14.5, -3.4 + hy, 0.7, H[1]);
  for (const x of [12.5, 13.5, 14.5]) {
    s.set(x, -6.5 + hy + (x - 12.5) * 0.4, H[1]);
    s.set(x + 0.5, -6.5 + hy + (x - 12.5) * 0.4, H[1]);
  }
  s.set(9, -11.5 + hy, DC.hideGlint);
  s.commit();
  s.begin();
  s.dot(16.5, -5 + hy, 1.4, DC.snout);
  s.shadeEdges(DC.snout, DC.snoutLit, H[0]);
  s.set(17, -5 + hy, DC.hideDeep);
  s.set(17, -4.5 + hy, DC.hideDeep);
  s.commit();
  s.begin();
  s.poly(
    [
      [7.4, -10.6 + hy],
      [9.4, -11.2 + hy],
      [5.5, -14.5 + hy],
    ],
    H[1],
  );
  s.shadeEdges(H[1], H[2], H[0]);
  s.stroke(8, -11 + hy, 6.6, -13 + hy, 0.2, DC.snout);
  s.commit();
  s.begin();
  s.stroke(10, -10.4 + hy, 12.5, -10 + hy, 0.5, H[1]);
  s.set(10, -10.5 + hy, DC.hideLit);
  s.set(10.5, -10.5 + hy, DC.hideLit);
  block(s, 10.5, -9.5 + hy, H[0], 1.5);
  const fierce = winding || charging;
  glowEye(s, 11, -9 + hy, fierce ? DC.crackHot : DC.crack, fierce ? WHITE : DC.eye);
  if (winding) {
    s.set(12, -9 + hy, DC.crack);
  }
  s.commit();
  // the tusk, curving up from the jaw to a glinting point
  s.begin();
  s.poly(
    [
      [13, -3.4 + hy],
      [14.2, -3.6 + hy],
      [15.6, -5.6 + hy],
      [16.2, -8.6 + hy],
      [15, -6 + hy],
    ],
    DC.tusk,
  );
  s.shadeEdges(DC.tusk, DC.thornTip, DC.tuskShade);
  s.set(16, -8.5 + hy, WHITE);
  s.commit();
  // the near legs, one pawing the ground before a charge
  const pawLift = Math.min(0, -Math.abs(paw) * 0.6);
  leg(s, -5, -5 + sag, -5 + step, 0, true);
  leg(s, 8, -5 + sag, 8 - step + paw, pawLift, true);
  s.outline(DC.outline);
  return s;
}
