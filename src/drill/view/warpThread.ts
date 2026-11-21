import { glowLine, hairline, line, place } from "../../engine/frame";
import type { Ramp } from "../../types/color";
import { WHITE } from "../../utils/color";
import { ease, lerp } from "../../utils/math";

const HEAD_FROM = 0.55;

export function drawWarpThread(x0: number, y0: number, x1: number, y1: number, age: number, ramp: Ramp): void {
  place();
  const u = ease.outCubic(age);
  const sx = lerp(x0, x1, u);
  const sy = lerp(y0, y1, u);
  const k = 1 - age;
  const mx = lerp(sx, x1, HEAD_FROM);
  const my = lerp(sy, y1, HEAD_FROM);
  hairline(sx, sy + 0.75, x1, y1 + 0.75, ramp[2], (v) => k * (0.3 + 0.5 * v));
  hairline(sx, sy, mx, my, ramp[4], (v) => k * (0.4 + 0.6 * v));
  line(mx, my, x1, y1, ramp[4], k);
  hairline(mx, my + 0.25, x1, y1 + 0.25, WHITE, (v) => k * (0.5 + v));
  glowLine(sx, sy, x1, y1, 7, ramp[3], 0.4 * k);
}
