import { circle, fleck, glowLine, px } from "../../../../engine/frame";
import { lerp } from "../../../../utils/math";
import { BLIGHT } from "../../colors";

const V = BLIGHT.stem;

export interface VinePath {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  bend: number;
  r0: number;
  r1: number;
}

export function vinePoint(v: VinePath, u: number): [number, number] {
  const len = Math.hypot(v.x1 - v.x0, v.y1 - v.y0) || 1;
  const nx = -(v.y1 - v.y0) / len;
  const ny = (v.x1 - v.x0) / len;
  const push = v.bend * 4 * u * (1 - u);
  return [lerp(v.x0, v.x1, u) + nx * push, lerp(v.y0, v.y1, u) + ny * push];
}

export function drawVine(v: VinePath, k: number, hot: number): void {
  const len = Math.hypot(v.x1 - v.x0, v.y1 - v.y0);
  const n = Math.max(4, Math.ceil(len * 1.2));
  for (let pass = 0; pass < 3; pass++)
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      const [x, y] = vinePoint(v, u);
      const r = lerp(v.r0, v.r1, u);
      if (pass === 0) circle(x, y, r + 0.5, BLIGHT.outline, k);
      else if (pass === 1) circle(x, y, r, V[2], k);
      else if (i % 2 === 0) fleck(x - r * 0.35, y - r * 0.6, V[3], k);
    }
  for (let i = 1; i < 7; i++) {
    const u = i / 7;
    const [x, y] = vinePoint(v, u);
    const r = lerp(v.r0, v.r1, u);
    const side = i % 2 ? -1 : 1;
    px(x + side * r * 0.4, y - r - 0.5, BLIGHT.bone[2], k);
    fleck(x + side * r * 0.4, y - r - 1.2, BLIGHT.bone[3], k);
    if (i % 3 === 0) fleck(x, y + r * 0.4, BLIGHT.spore[2], k);
  }
  if (hot > 0) glowLine(v.x0, v.y0, v.x1, v.y1, 5, BLIGHT.spore[2], 0.35 * hot * k);
}
