import { fleck, hairline, polygon } from "../../../../../engine/frame";
import type { Ramp } from "../../../../../types/color";
import { WHITE } from "../../../../../utils/color";
import { ease, smooth } from "../../../../../utils/math";
import type { VesperLayerDraw } from "../../../types/skillFx";

const STEPS = 12;
const ECLIPSE = [-2.3, 2.3] as const;

function moon(x: number, y: number, r: number, R: Ramp, alpha: number): void {
  const outer: [number, number][] = [];
  const inner: [number, number][] = [];
  for (let i = 0; i <= STEPS; i++) {
    const a = 0.12 * Math.PI + (i / STEPS) * 0.76 * Math.PI;
    outer.push([x + Math.cos(a) * r, y + Math.sin(a) * r]);
    inner.push([x + Math.cos(a) * r * 0.8, y - r * 0.32 + Math.sin(a) * r * 0.8]);
  }
  polygon([...outer, ...inner.slice().reverse()], R[4], alpha);
  for (let i = 1; i <= STEPS; i++) {
    hairline(outer[i - 1][0], outer[i - 1][1], outer[i][0], outer[i][1], WHITE, alpha);
  }
}

function drips(x: number, y: number, r: number, count: number, fall: number, R: Ramp, alpha: number): void {
  for (let i = 0; i < count; i++) {
    const dx = (i - (count - 1) / 2) * r * 0.6;
    const dy = r * 0.9 + fall * (0.6 + (i % 2) * 0.4);
    hairline(x + dx, y + dy - 3, x + dx, y + dy, R[3], alpha);
    fleck(x + dx, y + dy + 0.5, WHITE, alpha);
  }
}

export const drawCrescentLayer: VesperLayerDraw = (cast, kit, progress, fade, center) => {
  const rank = cast.feel.rank;
  const R = kit.look.ramp;
  const s = Math.sqrt(cast.size);
  const r = (5 + rank * 2.5) * s;
  const land = ease.outCubic(Math.min(1, progress * 3.5));
  const y = center.y - (1 - land) * 40 * s;
  const alpha = fade * (1 - smooth(0.55, 1, progress));
  moon(center.x, y, r, R, alpha);
  if (rank >= 2) drips(center.x, y, r, 3 + rank, progress * 10 * s, R, alpha);
  if (rank >= 3) {
    for (const side of ECLIPSE) moon(center.x + side * r, y + r * 0.4, r * 0.6, R, alpha * 0.85);
  }
};
