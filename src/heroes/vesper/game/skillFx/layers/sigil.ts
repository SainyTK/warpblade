import { fleck, hairline } from "../../../../../engine/frame";
import { fineRing } from "../../../../../game/effects/fine";
import type { Ramp } from "../../../../../types/color";
import { WHITE } from "../../../../../utils/color";
import { ease, smooth, TAU } from "../../../../../utils/math";
import type { VesperLayerDraw } from "../../../types/skillFx";

function diamond(x: number, y: number, r: number, turn: number, c: number, alpha: number): void {
  const p = [0, 1, 2, 3].map((i) => {
    const a = turn + (i * TAU) / 4;
    return [x + Math.cos(a) * r, y + Math.sin(a) * r * 1.2] as const;
  });
  for (let i = 0; i < 4; i++) hairline(p[i][0], p[i][1], p[(i + 1) % 4][0], p[(i + 1) % 4][1], c, alpha);
}

function ticks(x: number, y: number, r: number, count: number, turn: number, R: Ramp, alpha: number): void {
  for (let i = 0; i < count; i++) {
    const a = turn + (i / count) * TAU;
    hairline(
      x + Math.cos(a) * r,
      y + Math.sin(a) * r,
      x + Math.cos(a) * (r + 2),
      y + Math.sin(a) * (r + 2),
      R[4],
      alpha,
    );
  }
}

export const drawSigilLayer: VesperLayerDraw = (cast, kit, progress, fade, center) => {
  const rank = cast.feel.rank;
  const R = kit.look.ramp;
  const s = Math.sqrt(cast.size);
  const r = (4 + rank * 2) * s * ease.outBack(Math.min(1, progress * 3));
  const alpha = fade * (1 - smooth(0.6, 1, progress));
  const { x, y } = center;
  diamond(x, y, r, -Math.PI / 2, R[4], alpha);
  fineRing(x, y, r * 0.4, r * 0.3, R[5], alpha);
  fleck(x, y, WHITE, alpha);
  if (rank >= 1) ticks(x, y, r * 1.35, 6, progress * 3, R, alpha);
  if (rank >= 2) diamond(x, y, r * 1.1, -Math.PI / 4 + progress, R[3], alpha * 0.8);
  if (rank >= 3) {
    for (let i = 0; i < 4; i++) {
      const a = Math.PI / 4 + (i * TAU) / 4;
      kit.motif(x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3, a, r * 0.9, alpha, rank);
    }
  }
};
