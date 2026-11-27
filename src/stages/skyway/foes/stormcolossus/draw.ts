import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { grain } from "../../../../utils/grain";
import { SKY_FOES as C } from "../colors";
import { COLOSSUS as K } from "./colors";
import { type ColossusPose, colossusPose } from "./pose";

const canvas = detailCanvas(80, 76, 40, 68);
const B = K.bronze;

type Pt = readonly [number, number];

function leg(s: SpriteCanvas, hip: Pt, foot: Pt, near: boolean): void {
  const plate = near ? B[3] : B[2];
  const kx = (hip[0] + foot[0]) / 2 + 1;
  const ky = (hip[1] + foot[1]) / 2;
  s.begin();
  s.stroke(hip[0], hip[1], kx, ky, 3.2, plate);
  s.stroke(kx, ky, foot[0], foot[1] - 2, 2.8, plate);
  s.shadeEdges(plate, near ? B[4] : B[3], B[1], 2);
  s.commit();
  s.begin();
  s.dot(kx + 0.6, ky, 2.2, near ? K.patina[2] : K.patina[1]);
  s.shadeEdges(near ? K.patina[2] : K.patina[1], K.patina[3], K.patina[0]);
  s.commit();
  s.begin();
  s.poly(
    [
      [foot[0] - 4, foot[1] - 3.4],
      [foot[0] + 4.6, foot[1] - 3],
      [foot[0] + 5.4, foot[1]],
      [foot[0] - 4.4, foot[1]],
    ],
    near ? K.iron[2] : K.iron[1],
  );
  s.shadeEdges(near ? K.iron[2] : K.iron[1], K.iron[3], K.iron[0]);
  s.commit();
}

function arm(s: SpriteCanvas, shoulder: Pt, fist: Pt, near: boolean): void {
  const plate = near ? B[3] : B[2];
  const out = near ? 1 : -1;
  const ex = (shoulder[0] + fist[0]) / 2 + out * 2.5;
  const ey = (shoulder[1] + fist[1]) / 2 + 1;
  s.begin();
  s.stroke(shoulder[0], shoulder[1], ex, ey, 2.4, plate);
  s.stroke(ex, ey, fist[0], fist[1], 2.8, plate);
  s.shadeEdges(plate, near ? B[4] : B[3], B[1], 2);
  s.commit();
  s.begin();
  s.dot(fist[0], fist[1], 4.4, near ? K.iron[2] : K.iron[1]);
  s.shadeEdges(near ? K.iron[2] : K.iron[1], K.iron[3], K.iron[0], 2);
  s.commit();
  s.begin();
  s.stroke(fist[0] - 3, fist[1] - 2.6, fist[0] + 3, fist[1] - 2.6, 0.9, near ? B[3] : B[2]);
  s.shadeEdges(near ? B[3] : B[2], B[4], B[1]);
  s.commit();
  if (near) s.set(fist[0] - 1.6, fist[1] - 1.4, K.iron[4]);
}

function torso(s: SpriteCanvas, p: ColossusPose): void {
  s.begin();
  s.poly(
    [
      [-11, -38],
      [12.5, -38],
      [10, -25],
      [6.5, -17],
      [-6, -17],
      [-9.5, -25],
    ],
    B[2],
  );
  s.shadeEdges(B[2], B[3], B[1], 2);
  s.hairline(1, -37, 1, -18, B[1]);
  s.hairline(-9, -25.5, 10, -25.5, B[1]);
  s.hairline(7, -36.5, 9.4, -26.5, B[4]);
  for (let y = -37; y < -18; y += 1.5)
    for (let x = -10; x < 11; x += 1.5) {
      if (grain(x * 3 + 11, y * 3) > 0.84) s.set(x, y, K.patina[2]);
      else if (grain(y * 3, x * 3 + 7) > 0.9) s.set(x, y, K.patina[3]);
    }
  for (const x of [-7.5, -4.5, 6.5, 9.5]) s.set(x, -36.5, B[4]);
  s.commit();
  s.begin();
  s.poly(
    [
      [-7.5, -18],
      [8, -18],
      [9, -13],
      [-8.5, -13],
    ],
    K.cable[2],
  );
  s.shadeEdges(K.cable[2], B[2], K.cable[0]);
  s.hairline(-7, -15.5, 8.5, -15.5, B[3]);
  s.commit();
  core(s, p);
}

function core(s: SpriteCanvas, p: ColossusPose): void {
  const cx = 1.5;
  const cy = -29.5;
  s.begin();
  s.dot(cx, cy, 4.8, p.open > 0.3 ? B[1] : B[3]);
  s.shadeEdges(p.open > 0.3 ? B[1] : B[3], B[4], B[1]);
  s.commit();
  const glass: Color = p.core > 0.8 ? K.core[4] : p.core > 0.45 ? K.core[3] : K.core[1];
  s.begin();
  s.dot(cx, cy, 3.2, glass);
  s.shadeEdges(glass, p.core > 0.45 ? WHITE : K.core[2], K.core[0]);
  s.commit();
  s.begin();
  const bolt = p.core > 0.45 ? WHITE : K.core[3];
  s.hairline(cx - 1.5, cy - 2, cx + 0.5, cy - 0.3, bolt);
  s.hairline(cx + 0.5, cy - 0.3, cx - 0.6, cy + 0.6, bolt);
  s.hairline(cx - 0.6, cy + 0.6, cx + 1.4, cy + 2.2, bolt);
  s.commit(false);
  if (p.open > 0.3) {
    s.begin();
    s.poly(
      [
        [cx - 6, cy - 5.5],
        [cx - 1.5, cy - 6.5],
        [cx - 2.5, cy - 4.8],
      ],
      B[3],
    );
    s.poly(
      [
        [cx + 6, cy - 5],
        [cx + 2, cy - 6.6],
        [cx + 2.8, cy - 4.6],
      ],
      B[3],
    );
    s.shadeEdges(B[3], B[4], B[1]);
    s.commit();
  }
}

function pauldron(s: SpriteCanvas, x: number, near: boolean): void {
  const plate = near ? B[3] : B[2];
  s.begin();
  s.dot(x, -36, 5.6, plate);
  s.shadeEdges(plate, B[4], B[1], 2);
  for (let k = -1; k <= 1; k++) s.set(x + k * 2.4, -32, B[1]);
  s.commit();
  s.begin();
  s.dot(x - 1.4, -38.4, 1.4, near ? K.patina[3] : K.patina[2]);
  s.commit(false);
}

function head(s: SpriteCanvas, p: ColossusPose, time: number): void {
  const hy = -42 + p.dip;
  const w = Math.sin(time * 5) * 1;
  s.begin();
  s.taper(0, hy - 3, -11, hy - 2 + w, 2.6, 0.6, K.vapour[1], -0.6);
  s.taper(-1, hy - 1, -9, hy + 1.5 + w * 0.6, 1.6, 0.5, K.vapour[0], -0.3);
  s.shadeEdges(K.vapour[1], K.vapour[2], K.vapour[0]);
  s.commit();
  s.begin();
  s.dot(1.5, hy, 4, B[3]);
  s.poly(
    [
      [-2.5, hy + 1],
      [6, hy + 0.6],
      [5.4, hy + 3.6],
      [-2, hy + 3.8],
    ],
    B[2],
  );
  s.shadeEdges(B[3], B[4], B[1], 2);
  s.shadeEdges(B[2], B[3], B[1]);
  s.commit();
  s.begin();
  s.block(1.5, hy - 0.5, C.outline, 4.5, 1.2);
  const lit = p.core > 0.6 ? WHITE : K.slit;
  s.set(4, hy, lit);
  s.set(4.6, hy, lit);
  s.set(5.2, hy, p.core > 0.6 ? K.core[3] : K.slit);
  s.commit(false);
}

export function drawStormcolossus(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = colossusPose(e, time);
  const lift = Math.max(0, p.step) * 2;
  const sink = Math.max(0, -p.step) * 2;
  s.clear();
  s.shift(0, p.bob);
  leg(s, [-3.5, -17], [-4 - p.step * 3, -lift], false);
  s.shift(p.lean, p.bob);
  arm(s, [-9, -34], p.far, false);
  pauldron(s, -9, false);
  torso(s, p);
  s.shift(0, p.bob);
  leg(s, [4, -17], [5 + p.step * 3, -sink], true);
  s.shift(p.lean, p.bob);
  head(s, p, time);
  pauldron(s, 11, true);
  arm(s, [11, -34], p.near, true);
  s.shift(0, 0);
  s.outline(C.outline);
  return s;
}
