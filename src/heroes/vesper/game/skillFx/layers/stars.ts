import { hairline, haze, sparkle } from "../../../../../engine/frame";
import { WHITE } from "../../../../../utils/color";
import { grain } from "../../../../../utils/grain";
import { smooth, TAU } from "../../../../../utils/math";
import type { VesperLayerDraw } from "../../../types/skillFx";

const STREAKS = 3;

export const drawStarsLayer: VesperLayerDraw = (cast, kit, progress, fade, center) => {
  const rank = cast.feel.rank;
  const R = kit.look.ramp;
  const s = Math.sqrt(cast.size);
  const reach = (8 + rank * 4) * s;
  const alpha = fade * (1 - smooth(0.55, 1, progress));
  const { x, y } = center;
  if (rank >= 3) haze(x, y, reach * 1.1, reach * 0.8, kit.look.dark, 0.45 * alpha);
  const stars = 2 + rank * 3;
  for (let i = 0; i < stars; i++) {
    const a = grain(i, 11) * TAU + progress;
    const d = reach * (0.3 + 0.7 * grain(i, 4));
    const twinkle = 0.5 + 0.5 * Math.sin(progress * 20 + i * 2);
    sparkle(x + Math.cos(a) * d, y + Math.sin(a) * d, 1 + rank * 0.6, WHITE, R[4], 0.45 * alpha * twinkle);
  }
  if (rank >= 2) {
    for (let i = 0; i < STREAKS; i++) {
      const sx = x + (i - 1) * reach * 0.6;
      const head = y - reach + progress * reach * 2.2;
      hairline(sx + 4, head - 8, sx, head, R[4], (u) => u * alpha);
    }
  }
};
