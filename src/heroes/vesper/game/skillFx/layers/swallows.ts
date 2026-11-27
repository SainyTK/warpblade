import { fleck, hairline } from "../../../../../engine/frame";
import { WHITE } from "../../../../../utils/color";
import { ease, smooth } from "../../../../../utils/math";
import type { VesperLayerDraw } from "../../../types/skillFx";

const FLOCK = [1, 3, 5, 8] as const;

export const drawSwallowsLayer: VesperLayerDraw = (cast, kit, progress, fade, center) => {
  const rank = cast.feel.rank;
  const R = kit.look.ramp;
  const s = Math.sqrt(cast.size);
  const birds = FLOCK[rank];
  const fly = ease.outCubic(progress);
  const alpha = fade * (1 - smooth(0.6, 1, progress));
  const beat = Math.sin(progress * 40) * 1.2;
  for (let i = 0; i < birds; i++) {
    const a = -Math.PI / 2 + (i - (birds - 1) / 2) * 0.42;
    const d = (5 + 26 * fly) * s * (1 + (i % 2) * 0.2);
    const x = center.x + Math.cos(a) * d;
    const y = center.y + Math.sin(a) * d;
    const span = (2.5 + rank * 0.6) * s;
    const back = a + Math.PI;
    for (const side of [-0.7, 0.7]) {
      const wx = x + Math.cos(back + side) * span;
      const wy = y + Math.sin(back + side) * span - beat;
      hairline(x, y, wx, wy, R[3], alpha);
    }
    hairline(x, y, x + Math.cos(back) * span * 1.1, y + Math.sin(back) * span * 1.1, R[1], alpha);
    fleck(x, y, WHITE, alpha);
  }
};
