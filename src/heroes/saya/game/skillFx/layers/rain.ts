import { fleck, line } from "../../../../../engine/frame";
import { grain } from "../../../../../utils/grain";
import { smooth } from "../../../../../utils/math";
import type { SayaLayerDraw } from "../../../types/skillFx";

export const drawRainLayer: SayaLayerDraw = (cast, kit, progress, fade, center) => {
  const rank = cast.feel.rank;
  const R = kit.look.ramp;
  const s = Math.sqrt(cast.size);
  const streaks = 3 + rank * 3;
  const width = (8 + rank * 6) * s;
  const top = -(26 + rank * 10) * s;
  const alpha = fade * (1 - smooth(0.6, 1, progress));
  for (let i = 0; i < streaks; i++) {
    const x = center.x + (grain(i, 5) - 0.5) * width * 2;
    const phase = (progress * 2.5 + grain(i, 2)) % 1;
    const y = center.y + top * (1 - phase);
    const length = (4 + rank) * s;
    line(x, y - length, x, y, kit.look.dark, alpha);
    fleck(x, y, R[4], alpha);
  }
};
