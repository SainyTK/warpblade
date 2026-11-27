import { fleck, hairline, polygon } from "../../../../../engine/frame";
import { WHITE } from "../../../../../utils/color";
import { ease, smooth } from "../../../../../utils/math";
import type { SayaLayerDraw } from "../../../types/skillFx";

const FLOCK = [1, 2, 3, 6] as const;

export const drawCranesLayer: SayaLayerDraw = (cast, kit, progress, fade, center) => {
  const rank = cast.feel.rank;
  const R = kit.look.ramp;
  const s = Math.sqrt(cast.size);
  const birds = FLOCK[rank];
  const fly = ease.outCubic(progress);
  const alpha = fade * (1 - smooth(0.6, 1, progress));
  const beat = Math.sin(progress * 30) * 2;
  const span = (3 + rank * 0.6) * s;
  for (let i = 0; i < birds; i++) {
    const a = -Math.PI / 2 + (i - (birds - 1) / 2) * 0.55;
    const d = (4 + 24 * fly) * s;
    const x = center.x + Math.cos(a) * d;
    const y = center.y + Math.sin(a) * d;
    polygon(
      [
        [x - span, y - beat],
        [x, y + 1],
        [x + span, y - beat],
        [x, y - 1.5],
      ],
      R[4],
      alpha,
    );
    hairline(x - span, y - beat, x, y - 1.5, WHITE, alpha);
    hairline(x, y - 1.5, x + span, y - beat, kit.look.dark, alpha);
    fleck(x + span * 0.6, y - 2.5, kit.look.dark, alpha);
  }
};
