import { ellipseRing, fleck, line } from "../../../../../engine/frame";
import { grain } from "../../../../../utils/grain";
import { smooth } from "../../../../../utils/math";
import type { SayaLayerDraw } from "../../../types/skillFx";

const FALL = 60;

export const drawDripsLayer: SayaLayerDraw = (cast, kit, progress, fade, center) => {
  const rank = cast.feel.rank;
  const R = kit.look.ramp;
  const s = Math.sqrt(cast.size);
  const drops = 2 + rank * 2;
  const spread = (6 + rank * 3) * s;
  const alpha = fade * (1 - smooth(0.6, 1, progress));
  for (let i = 0; i < drops; i++) {
    const x = center.x + (i / Math.max(1, drops - 1) - 0.5) * spread * 2;
    const start = grain(i, 7) * 0.2;
    const t = Math.max(0, progress - start);
    const y = center.y + 2 + FALL * t * t * 4 * s;
    line(x, y - 2 - rank * 0.5, x, y, kit.look.dark, alpha);
    fleck(x, y + 0.5, R[4], alpha);
  }
  if (rank >= 3) {
    const pool = smooth(0.2, 0.6, progress) * spread * 1.4;
    ellipseRing(center.x, center.y + spread * 1.6, pool, pool * 0.25, R[3], alpha);
  }
};
