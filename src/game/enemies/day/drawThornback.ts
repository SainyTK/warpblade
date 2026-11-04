import { SpriteCanvas } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import { WHITE } from "../../../utils/color";
import { DAY_COLORS as DC } from "./colors";

const canvas = new SpriteCanvas(54, 38, 27, 34);
const H = DC.hide;
const B = DC.bramble;
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
  s.clear();
  // the far legs
  s.begin();
  s.stroke(-8, -6 + sag, -8 - step, 0, 1.5, H[0]);
  s.stroke(6, -6 + sag, 6 + step, 0, 1.5, H[0]);
  s.commit();
  // the body and its bramble wraps
  s.begin();
  const by = lift + sag;
  s.dot(-8, -8 + by, 4.5, H[1]);
  s.dot(-3, -9 + by, 6.5, H[1]);
  s.dot(4, -9.5 + by, 6, H[1]);
  s.dot(-3, -11 + by, 4.6, H[2]);
  s.dot(4, -12 + by, 3.6, H[2]);
  s.stroke(-6, -4 + by, 5, -4 + by, 1, H[0]);
  s.stroke(-10, -12 + by, -4, -4 + by, 0.7, B[1]);
  s.stroke(-2, -15 + by, 4, -4 + by, 0.7, B[1]);
  s.stroke(5, -14 + by, 9, -7 + by, 0.6, B[1]);
  for (const [x, y] of [
    [-9, -10],
    [-6, -7],
    [0, -12],
    [2, -8],
    [6, -12],
  ])
    s.set(x, y + by, B[3]);
  // the rift crack on its flank, glowing
  for (const [x, y, hot] of [
    [-4, -11, 0],
    [-3, -10, 1],
    [-3, -9, 1],
    [-2, -8, 1],
    [-2, -7, 0],
    [-1, -6, 0],
    [-4, -12, 0],
  ])
    s.set(x, y + by, hot ? DC.crackHot : DC.crack);
  s.commit();
  // the hump of thorns, raised when it means to charge
  s.begin();
  const bristle = winding ? 1 : charging ? -1 : 0;
  for (const [x, y, L] of SPINES) {
    const len = L + bristle;
    const tx = x - len * (charging ? 0.9 : 0.45);
    const ty = y - len;
    s.stroke(x, y + by + 1, tx, ty + by, 0.7, B[2]);
    s.set(tx, ty + by, DC.thornTip);
    s.set((x + tx) / 2, (y + ty) / 2 + by, DC.thorn);
  }
  s.commit(false);
  // the head, lowered to charge
  s.begin();
  const hy = drop + by;
  s.dot(10, -8 + hy, 4, H[1]);
  s.dot(9.5, -9.5 + hy, 2.4, H[2]);
  s.stroke(11, -7 + hy, 15.5, -5 + hy, 2.3, H[2]);
  s.dot(16.5, -5 + hy, 1.4, H[0]);
  s.set(17, -6 + hy, H[3]);
  s.stroke(8, -11 + hy, 5.5, -14 + hy, 0.9, H[0]);
  s.stroke(13.5, -3.5 + hy, 16, -8 + hy, 0.55, DC.tusk);
  s.set(16, -9 + hy, DC.thornTip);
  s.set(11, -9 + hy, winding || charging ? WHITE : DC.eye);
  s.set(12, -9 + hy, winding ? DC.crackHot : H[0]);
  s.commit();
  // the near legs, one pawing the ground before a charge
  s.begin();
  s.stroke(-5, -5 + sag, -5 + step, 0, 1.6, H[2]);
  s.stroke(8, -5 + sag, 8 - step + paw, Math.min(0, -Math.abs(paw) * 0.6), 1.6, H[2]);
  s.dot(-5 + step, -0.5, 1.3, H[0]);
  s.dot(8 - step + paw, -0.5 + Math.min(0, -Math.abs(paw) * 0.6), 1.3, H[0]);
  s.commit();
  s.outline(DC.outline);
  return s;
}
