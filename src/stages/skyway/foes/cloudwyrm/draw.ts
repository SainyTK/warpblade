import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Ramp } from "../../../../types/color";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { SKY_FOES as C } from "../colors";
import { WYRM as K } from "./colors";
import { SEGMENTS } from "./constants";
import { type WyrmPose, wyrmPose } from "./pose";

const canvas = detailCanvas(96, 56, 66, 28);

type Pt = readonly [number, number];

function spine(p: WyrmPose, time: number): Pt[] {
  const pts: Pt[] = [];
  for (let k = 0; k <= SEGMENTS; k++) {
    const x = -4 - k * 5.2;
    const y = Math.sin(time * p.speed - k * 0.9) * p.wave * (0.3 + k * 0.12);
    pts.push([x, y]);
  }
  return pts;
}

function body(s: SpriteCanvas, pts: Pt[], tone: Ramp, p: WyrmPose): void {
  for (let k = pts.length - 1; k >= 1; k--) {
    const r = 3.4 - k * 0.32;
    const [x, y] = pts[k];
    const [nx, ny] = pts[k - 1];
    s.begin();
    s.stroke(x, y, nx, ny, r, tone[2]);
    s.shadeEdges(tone[2], tone[3], tone[0], 2);
    s.commit();
    s.begin();
    s.stroke(x, y + r * 0.6, nx, ny + r * 0.6, Math.max(0.6, r * 0.35), K.belly[1]);
    s.shadeEdges(K.belly[1], K.belly[2], K.belly[0]);
    s.commit();
    s.begin();
    if (p.open) {
      s.set(x + 1.2, y - r * 0.5, K.volt[2]);
      s.set(x - 0.6, y - r * 0.2, K.volt[1]);
    } else s.set(x + 1, y - r * 0.6, tone[4]);
    s.commit(false);
    if (k % 2 === 1) {
      s.begin();
      s.poly(
        [
          [x + 1, y - r + 0.4],
          [x - 2.5, y - r - 2.8],
          [x - 1.6, y - r + 0.6],
        ],
        K.fin[1],
      );
      s.shadeEdges(K.fin[1], K.fin[2], K.fin[0]);
      s.commit();
    }
  }
  const [tx, ty] = pts[pts.length - 1];
  s.begin();
  s.poly(
    [
      [tx + 1, ty],
      [tx - 5, ty - 3],
      [tx - 3.5, ty],
      [tx - 5, ty + 3],
    ],
    K.fin[1],
  );
  s.shadeEdges(K.fin[1], K.fin[3], K.fin[0]);
  s.commit();
}

function head(s: SpriteCanvas, p: WyrmPose, tone: Ramp, time: number): void {
  const ca = Math.cos(p.aim);
  const sa = Math.sin(p.aim);
  const at = (x: number, y: number): Pt => [x * ca - y * sa, x * sa + y * ca];
  const jaw = p.jaw * 2.2;
  s.begin();
  s.poly([at(-3, -3), at(3, -3.6), at(9.5, -1.6), at(10, 0), at(2, 0.8), at(-3, 2)], tone[2]);
  s.shadeEdges(tone[2], tone[3], tone[0], 2);
  s.commit();
  s.begin();
  s.poly([at(-1, 1), at(8.5, 0.6 + jaw), at(8, 2 + jaw), at(-1, 3)], tone[1]);
  s.shadeEdges(tone[1], tone[2], tone[0]);
  s.commit();
  if (p.jaw > 0.2) {
    s.begin();
    const [mx, my] = at(8.6, 0.6 + jaw * 0.5);
    s.dot(mx, my, 0.4 + p.charge * 1.4, p.charge > 0.7 ? WHITE : K.volt[3]);
    s.commit(false);
  }
  s.begin();
  for (const [bx, by, ex, ey] of [
    [0, -3.2, -5.5, -7.5],
    [2, -3.4, -2.5, -8.2],
  ] as const) {
    const [x0, y0] = at(bx, by);
    const [x1, y1] = at(ex, ey);
    s.taper(x0, y0, x1, y1, 0.9, 0.3, K.horn[2], -0.4);
  }
  s.shadeEdges(K.horn[2], K.horn[3], K.horn[1]);
  s.commit();
  s.begin();
  const w = Math.sin(time * 5) * 1.2;
  const [w0x, w0y] = at(8, 1);
  const [w1x, w1y] = at(4, 5 + w);
  const [w2x, w2y] = at(0, 6 + w * 1.4);
  s.hairline(w0x, w0y, w1x, w1y, K.fin[2]);
  s.hairline(w1x, w1y, w2x, w2y, K.fin[1]);
  s.commit(false);
  s.begin();
  const [ex, ey] = at(4.5, -1.8);
  s.block(ex - 0.5, ey - 0.5, p.charge > 0.5 ? WHITE : K.eye, 1.5, 1);
  s.set(ex + 1, ey, K.volt[3]);
  s.commit(false);
}

export function drawCloudwyrm(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = wyrmPose(e);
  const tone = p.open ? K.dull : K.scale;
  const pts = spine(p, time);
  s.clear();
  body(s, pts, tone, p);
  head(s, p, tone, time);
  s.outline(C.outline);
  return s;
}
