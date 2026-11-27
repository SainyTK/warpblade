import { ellipseRing, line, sparkle } from "../../../../../engine/frame";
import { WHITE } from "../../../../../utils/color";
import { ease, smooth, TAU } from "../../../../../utils/math";
import type { SayaLayerDraw } from "../../../types/skillFx";

const SPIKES = 10;

export const drawRingLayer: SayaLayerDraw = (cast, kit, progress, fade, center) => {
  const rank = cast.feel.rank;
  const R = kit.look.ramp;
  const s = Math.sqrt(cast.size);
  const r = (7 + rank * 3) * s * ease.outCubic(Math.min(1, progress * 3));
  const alpha = fade * (1 - smooth(0.55, 1, progress));
  const { x, y } = center;
  ellipseRing(x, y, r, r * 0.45, kit.look.dark, alpha);
  ellipseRing(x, y - 0.5, r, r * 0.45, R[4], alpha);
  if (rank >= 1) sparkle(x + r, y, 2 + rank * 0.5, WHITE, R[4], 0.45 * alpha);
  if (rank >= 2) ellipseRing(x, y, r * 1.3, r * 0.6, R[3], alpha * 0.7);
  if (rank >= 3) {
    for (let i = 0; i < SPIKES; i++) {
      const a = (i / SPIKES) * TAU + progress;
      const r0 = r * 1.35;
      const r1 = r * 1.8;
      line(
        x + Math.cos(a) * r0,
        y + Math.sin(a) * r0 * 0.6,
        x + Math.cos(a) * r1,
        y + Math.sin(a) * r1 * 0.6,
        R[4],
        alpha,
      );
    }
  }
};
