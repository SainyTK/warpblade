import { ellipseRing, hairline, sparkle } from "../../../../../engine/frame";
import { WHITE } from "../../../../../utils/color";
import { ease, smooth, TAU } from "../../../../../utils/math";
import type { VesperLayerDraw } from "../../../types/skillFx";

const GLINTS = 4;
const SPOKES = 8;

export const drawWardLayer: VesperLayerDraw = (cast, kit, progress, fade, center) => {
  const rank = cast.feel.rank;
  const R = kit.look.ramp;
  const s = Math.sqrt(cast.size);
  const grow = ease.outCubic(Math.min(1, progress * 3));
  const rx = (8 + rank * 3) * s * grow;
  const ry = rx * 1.3;
  const alpha = fade * (1 - smooth(0.55, 1, progress));
  const { x, y } = center;
  ellipseRing(x, y, rx, ry, R[4], alpha);
  if (rank >= 1) ellipseRing(x, y, rx * 0.8, ry * 0.8, R[2], alpha * 0.8);
  if (rank >= 2) {
    for (let i = 0; i < GLINTS; i++) {
      const a = (i / GLINTS) * TAU + progress * 4;
      sparkle(x + Math.cos(a) * rx, y + Math.sin(a) * ry, 1.5 + rank * 0.5, WHITE, R[4], 0.4 * alpha);
    }
  }
  if (rank >= 3) {
    for (let i = 0; i < SPOKES; i++) {
      const a = (i / SPOKES) * TAU - progress * 3;
      const x0 = x + Math.cos(a) * rx * 1.15;
      const y0 = y + Math.sin(a) * ry * 1.15;
      const x1 = x + Math.cos(a) * rx * 1.55;
      const y1 = y + Math.sin(a) * ry * 1.55;
      hairline(x0, y0, x1, y1, R[4], alpha);
      hairline(x0 + 0.5, y0, x1 + 0.5, y1, WHITE, alpha * 0.7);
    }
  }
};
