import { fleck, hairline, line } from "../../../../engine/frame";
import type { Color } from "../../../../types/color";
import type { ElementKit, FxCast } from "../../../../types/skillFx";
import { grain } from "../../../../utils/grain";
import { clamp, ease, TAU } from "../../../../utils/math";

const FLAT = 0.3;
const TURNS = 2.2;
const FUNNEL_RINGS = 5;
const BLADES = 4;

interface Ring {
  cy: number;
  rx: number;
  spin: number;
  grains: number;
  front: Color;
  back: Color;
}

function drawRing(ring: Ring, turn: number, alpha: number): void {
  for (let i = 0; i < ring.grains; i++) {
    const a = (i / ring.grains) * TAU + turn * ring.spin;
    const near = Math.sin(a) > 0;
    const x = Math.cos(a) * ring.rx;
    const y = ring.cy + Math.sin(a) * ring.rx * FLAT;
    const tail = 2 + ring.rx * 0.18;
    const tx = x + Math.sin(a) * tail * ring.spin;
    const ty = y - Math.cos(a) * tail * FLAT * ring.spin;
    hairline(x, y, tx, ty, near ? ring.front : ring.back, (u) => alpha * (1 - u) * (near ? 1 : 0.6));
    if (near && i % 2 === 0) fleck(x, y - 0.5, ring.front, alpha);
  }
}

function drawBlade(x: number, y: number, angle: number, length: number, edge: Color, body: Color, alpha: number): void {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const bend = length * 0.3;
  const mx = x + c * length * 0.5 - s * bend;
  const my = y + s * length * 0.5 + c * bend;
  const ex = x + c * length;
  const ey = y + s * length;
  line(x, y, mx, my, body, alpha);
  hairline(mx, my, ex, ey, body, alpha);
  hairline(x, y - 0.5, mx, my - 0.5, edge, alpha);
  fleck(ex, ey, edge, alpha);
}

export function drawDervish(
  cast: FxCast,
  kit: ElementKit,
  progress: number,
  fade: number,
  lift: number,
  mastery: number,
): void {
  const R = kit.look.ramp;
  const rank = cast.feel.rank;
  const radius = 8 * Math.sqrt(cast.size);
  const turn = ease.outCubic(clamp(progress * 1.2)) * TAU * TURNS;
  const open = 0.55 + 0.45 * ease.outCubic(clamp(progress * 2.4));
  const cy = -lift;
  const rings: Ring[] = [{ cy, rx: radius * open, spin: 1, grains: 10, front: R[4], back: R[2] }];
  if (rank >= 1) rings.push({ cy: cy - 5, rx: radius * 0.8 * open, spin: -1, grains: 12, front: R[3], back: R[1] });
  if (rank >= 2) rings.push({ cy: cy - 11, rx: radius * 1.15 * open, spin: 1.3, grains: 14, front: R[4], back: R[2] });
  if (rank >= 3) {
    for (let i = 0; i < FUNNEL_RINGS; i++) {
      const u = i / (FUNNEL_RINGS - 1);
      const flare = 1 + ease.outCubic(clamp(progress * 1.5)) * u * 0.8;
      rings.push({
        cy: cy + 8 - u * 34 * Math.sqrt(cast.size / 2.6),
        rx: radius * (0.45 + u * 1.1) * flare,
        spin: i % 2 ? -1.5 : 1.5,
        grains: 12 + i * 3,
        front: R[3 + (i % 2)],
        back: R[1],
      });
    }
  }
  if (mastery > 0) {
    rings.push({ cy, rx: radius * 1.45 * open, spin: -0.7, grains: 8 + mastery * 3, front: R[5], back: R[3] });
  }
  for (const ring of rings) drawRing(ring, turn, fade);
  if (rank >= 1) {
    const a = turn + 0.4;
    const bx = Math.cos(a) * radius * open;
    const by = cy + Math.sin(a) * radius * open * FLAT;
    drawBlade(bx, by, a + Math.PI / 2, 4 + rank, R[5], R[3], fade);
  }
  if (rank >= 2) {
    for (let i = 0; i < 4; i++) {
      const a = turn * 0.7 + (i / 4) * TAU;
      const rise = clamp(progress * 1.6 - i * 0.08);
      const x0 = Math.cos(a) * radius * 0.9;
      const y0 = cy + 2;
      const x1 = Math.cos(a + 0.9) * radius * 0.5;
      const y1 = cy - 8 - rise * 14;
      hairline(x0, y0, x1, y1, R[3], (u) => fade * u * (1 - progress));
    }
  }
  if (rank >= 3) {
    for (let i = 0; i < BLADES; i++) {
      const a = turn * 1.3 + (i / BLADES) * TAU;
      const d = radius * (1.3 + 0.5 * ease.outCubic(clamp(progress * 2)));
      const h = cy - 6 - grain(i, 4) * 14;
      drawBlade(Math.cos(a) * d, h + Math.sin(a) * d * FLAT, a + Math.PI / 2, 7, R[5], R[3], fade);
    }
  }
}
