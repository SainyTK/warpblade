import { putImage } from "../../../engine/frame";
import type { Color } from "../../../types/color";

/** a metal's tones: the dark line round it, its shaded underside, its body and its lit upper side */
export interface Metal {
  rim: Color;
  shade: Color;
  body: Color;
  light: Color;
}

/** how far across a tube, as a share of its half thickness, the light ends and the shade begins */
const LIT = -0.2;
const SHADED = 0.45;
/** the light comes from above and a little from the left: how much each counts */
const UP = 0.85;
const LEFT = 0.5;

/**
 * A bent bar of metal at image pixel detail: `nodes` holds x, y and half thickness for each of `count` places along its
 * centre line, in image pixels. Every pixel takes its tone from where it sits across the bar, lit from above and the left, and a dark
 * line one pixel wide runs round the whole shape.
 */
export function drawTube(nodes: ArrayLike<number>, count: number, m: Metal, a = 1): void {
  let x0 = Number.POSITIVE_INFINITY;
  let y0 = Number.POSITIVE_INFINITY;
  let x1 = Number.NEGATIVE_INFINITY;
  let y1 = Number.NEGATIVE_INFINITY;
  for (let i = 0; i < count; i++) {
    const r = nodes[i * 3 + 2] + 1;
    x0 = Math.min(x0, nodes[i * 3] - r);
    y0 = Math.min(y0, nodes[i * 3 + 1] - r);
    x1 = Math.max(x1, nodes[i * 3] + r);
    y1 = Math.max(y1, nodes[i * 3 + 1] + r);
  }
  for (let py = Math.floor(y0); py <= Math.ceil(y1); py++)
    for (let px = Math.floor(x0); px <= Math.ceil(x1); px++) {
      let best = Number.POSITIVE_INFINITY;
      let across = 0;
      for (let i = 0; i < Math.max(1, count - 1); i++) {
        const j = Math.min(count - 1, i + 1);
        const ax = nodes[i * 3];
        const ay = nodes[i * 3 + 1];
        const dx = nodes[j * 3] - ax;
        const dy = nodes[j * 3 + 1] - ay;
        const len2 = dx * dx + dy * dy;
        const t = len2 > 0 ? Math.max(0, Math.min(1, ((px + 0.5 - ax) * dx + (py + 0.5 - ay) * dy) / len2)) : 0;
        const r = nodes[i * 3 + 2] + (nodes[j * 3 + 2] - nodes[i * 3 + 2]) * t;
        const ox = px + 0.5 - (ax + dx * t);
        const oy = py + 0.5 - (ay + dy * t);
        const d = Math.hypot(ox, oy) - r;
        if (d < best) {
          best = d;
          across = (oy * UP + ox * LEFT) / Math.max(r, 0.5);
        }
      }
      if (best > 1) continue;
      putImage(px, py, best > 0 ? m.rim : across < LIT ? m.light : across > SHADED ? m.shade : m.body, a);
    }
}
