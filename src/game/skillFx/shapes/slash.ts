import { W } from "../../../constants/stage";
import { glowLine, hairline, line } from "../../../engine/frame";
import type { FxShapeDraw } from "../../../types/skillFx";
import { WHITE } from "../../../utils/color";
import { ease, smooth } from "../../../utils/math";
import { type Arc, arcPoint, drawBand } from "./band";

const FROM = -1.35;
const TO = 1.25;
const MOTIFS = 7;

function sweep(base: Arc, progress: number): Arc {
  const head = base.from + (base.to - base.from) * ease.outCubic(Math.min(1, progress * 2.6));
  const tail = base.from + (head - base.from) * smooth(0.25, 1, progress);
  return { ...base, from: tail, to: head };
}

export const drawSlash: FxShapeDraw = (cast, at, kit, progress, fade) => {
  const rank = cast.feel.rank;
  const reach = (at.reach ?? 20) * (1 + (cast.size - 1) * 0.4);
  const base: Arc = {
    cx: reach * 0.15,
    cy: 0,
    radius: reach,
    squash: 0.9,
    from: FROM,
    to: TO,
    width: 2 + reach * 0.12 * cast.size,
  };
  const arc = sweep(base, progress);
  drawBand(arc, kit.look.ramp, fade, rank >= 2);
  if (rank >= 1) {
    for (let i = 0; i < MOTIFS + rank * 2; i++) {
      const a = arc.from + ((arc.to - arc.from) * (i + 0.5)) / (MOTIFS + rank * 2);
      const [x, y] = arcPoint(arc, a, 1);
      kit.motif(x, y, a, 2 + rank * 1.6, fade, rank);
    }
  }
  if (rank >= 2) {
    const cross = sweep({ ...base, radius: reach * 0.8, squash: -0.9, cy: 0, width: base.width * 0.8 }, progress * 0.9);
    drawBand(cross, kit.look.ramp, fade * 0.9, true);
  }
  if (rank >= 3) {
    const high = sweep({ ...base, cy: -reach * 0.35, radius: reach * 1.25, width: base.width * 0.7 }, progress * 0.8);
    const low = sweep({ ...base, cy: reach * 0.35, radius: reach * 1.25, width: base.width * 0.7 }, progress * 0.85);
    drawBand(high, kit.look.ramp, fade * 0.8, false);
    drawBand(low, kit.look.ramp, fade * 0.8, false);
  }
  if (cast.fillsScreen) {
    const open = ease.outExpo(Math.min(1, progress * 3));
    const far = W * open;
    line(-8, 0, far, 0, kit.look.ramp[4], fade);
    hairline(-8, -0.5, far, -0.5, WHITE, fade);
    glowLine(0, 0, far, 0, 10, kit.look.ramp[3], 0.3 * fade);
  }
};
