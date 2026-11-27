import { hairline, polygon } from "../../../../../engine/frame";
import type { Color, Ramp } from "../../../../../types/color";
import { WHITE } from "../../../../../utils/color";
import { ease, smooth } from "../../../../../utils/math";
import type { SayaLayerDraw } from "../../../types/skillFx";

const STEPS = 14;

function crescent(x: number, y: number, r: number, R: Ramp, dark: Color, alpha: number): void {
  const outer: [number, number][] = [];
  const inner: [number, number][] = [];
  for (let i = 0; i <= STEPS; i++) {
    const a = -0.42 * Math.PI + (i / STEPS) * 0.84 * Math.PI;
    outer.push([x + Math.cos(a) * r, y + Math.sin(a) * r]);
    inner.push([x - r * 0.38 + Math.cos(a) * r * 0.86, y + Math.sin(a) * r * 0.86]);
  }
  polygon([...outer, ...inner.slice().reverse()], dark, alpha);
  polygon([...outer, ...inner.map(([px, py]) => [px + r * 0.2, py] as [number, number]).reverse()], R[4], alpha);
  for (let i = 1; i <= STEPS; i++) {
    hairline(outer[i - 1][0], outer[i - 1][1], outer[i][0], outer[i][1], WHITE, alpha);
  }
}

export const drawMoonLayer: SayaLayerDraw = (cast, kit, progress, fade, center) => {
  const rank = cast.feel.rank;
  const s = Math.sqrt(cast.size);
  const r = (5 + rank * 2.5) * s * ease.outBack(Math.min(1, progress * 3));
  const alpha = fade * (1 - smooth(0.55, 1, progress));
  const x = center.x + r * 0.6;
  const y = center.y;
  if (rank >= 2) crescent(x - r * 0.7, y, r * 0.85, kit.look.ramp, kit.look.dark, alpha * 0.5);
  crescent(x, y, r, kit.look.ramp, kit.look.dark, alpha);
  if (rank >= 3) crescent(x + r * 0.9, y - r * 0.2, r * 0.75, kit.look.ramp, kit.look.dark, alpha * 0.9);
};
