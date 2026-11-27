import { ellipseRing, fleck } from "../../../../../engine/frame";
import { WHITE } from "../../../../../utils/color";
import { smooth, TAU } from "../../../../../utils/math";
import type { VesperLayerDraw } from "../../../types/skillFx";

const DEBRIS = 8;

export const drawSpiralLayer: VesperLayerDraw = (cast, kit, progress, fade) => {
  const rank = cast.feel.rank;
  const R = kit.look.ramp;
  const s = Math.sqrt(cast.size);
  const rings = 3 + rank * 2;
  const rise = smooth(0, 0.35, progress);
  const alpha = fade * (1 - smooth(0.6, 1, progress));
  const step = (3 + rank * 0.5) * s;
  for (let i = 0; i < rings; i++) {
    const v = i / Math.max(1, rings - 1);
    if (v > rise) break;
    const rx = (3 + i * 1.8) * s;
    const sway = Math.sin(progress * 9 + i * 0.9) * (1 + rank * 0.5);
    const y = -i * step;
    ellipseRing(sway, y, rx, rx * 0.28, i % 2 ? R[4] : R[3], alpha * (0.55 + 0.45 * v));
    const a = progress * 14 + i * 1.3;
    fleck(sway + Math.cos(a) * rx, y + Math.sin(a) * rx * 0.28, WHITE, alpha);
  }
  if (rank >= 3) {
    const top = rings * step;
    for (let i = 0; i < DEBRIS; i++) {
      const a = (i / DEBRIS) * TAU + progress * 8;
      const rx = top * 0.55;
      fleck(Math.cos(a) * rx, -top * (0.3 + 0.6 * ((i * 37) % 10) * 0.1), R[5], alpha);
    }
  }
};
