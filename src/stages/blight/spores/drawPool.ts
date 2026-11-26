import { fleck, glow, hairline, px, shade } from "../../../engine/frame";
import { mix } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { clamp } from "../../../utils/math";
import { BLIGHT } from "../colors";

const P = BLIGHT.poison;
const DEPTH = 3;
const BUBBLES = 5;

export function drawPoolSurface(x0: number, x1: number, y: number, t: number, k: number, heave: number): void {
  if (k <= 0.02) return;
  const width = x1 - x0;
  const mid = (x0 + x1) / 2;
  const lift = heave * 1.5;
  shade(x0 - 1, y - 2 - lift, x1 + 1, y + DEPTH + 1, (x, py, out) => {
    const u = (x - x0) / width;
    if (u < 0 || u > 1) return;
    const edge = Math.min(u, 1 - u) * width;
    const crest = y - Math.min(1, edge / 3) * (0.5 + lift) + Math.sin(x * 0.9 + t * 3) * 0.3;
    if (py < crest - 0.5) return;
    const v = py - crest;
    const ripple = Math.sin(x * 0.7 - t * 2.4) + Math.sin(x * 1.9 + t * 3.1) * 0.5;
    if (v < 0.5) {
      out.c = ripple > 0.6 ? P[4] : P[3];
    } else if (v < 1.5) {
      out.c = ripple > 1 ? P[3] : P[2];
    } else if (v < DEPTH) {
      out.c = grain(Math.floor(x * 2), Math.floor(py * 2)) > 0.7 ? P[2] : P[1];
    } else {
      out.c = P[0];
    }
    out.a = clamp(edge / 1.5) * k;
  });
  for (let i = 0; i < BUBBLES; i++) {
    const cycle = (t * (0.7 + grain(i, x0) * 0.6) + grain(x0, i)) % 1;
    const bx = x0 + 2 + grain(i * 7, x0) * (width - 4);
    const swell = cycle < 0.8 ? cycle / 0.8 : 1;
    const by = y - 0.5 - swell * (1 + heave);
    if (cycle < 0.8) {
      px(bx - 0.5, by - 0.5, mix(P[3], P[4], swell), k);
      fleck(bx - 0.5, by - 1, P[4], k * swell);
    } else {
      const pop = (cycle - 0.8) / 0.2;
      fleck(bx - 1 - pop * 2, by - pop * 2, P[4], k * (1 - pop));
      fleck(bx + pop * 2, by - pop * 2.5, P[4], k * (1 - pop));
    }
  }
  hairline(x0 + 1, y + DEPTH + 0.5, x1 - 1, y + DEPTH + 0.5, P[0], 0.6 * k);
  glow(mid, y, width * 0.5 + 6 + heave * 6, P[3], (0.16 + heave * 0.3) * k);
}
