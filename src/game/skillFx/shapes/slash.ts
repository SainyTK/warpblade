import { W } from "../../../constants/stage";
import { glowLine, hairline, line } from "../../../engine/frame";
import type { FxShapeDraw } from "../../../types/skillFx";
import { ease, smooth } from "../../../utils/math";
import { type Arc, arcPoint, drawBand } from "./band";

const FROM = -1.35;
const TO = 1.25;
const MOTIFS = 7;
const RADIUS_BY_RANK = [1, 1.25, 1.55, 2.1] as const;
const RADIUS_MOST = 60;
const WIDTH_BY_RANK = [2.5, 4, 6, 9] as const;

function sweep(base: Arc, progress: number): Arc {
  const head = base.from + (base.to - base.from) * ease.outCubic(Math.min(1, progress * 4.5));
  const tail = base.from + (head - base.from) * smooth(0.45, 1, progress);
  return { ...base, from: tail, to: head };
}

export const drawSlash: FxShapeDraw = (cast, at, kit, progress, fade) => {
  const rank = cast.feel.rank;
  const grade = 1 + 0.3 * cast.gradeInTier;
  const reach = Math.min(RADIUS_MOST, (at.reach ?? 20) * RADIUS_BY_RANK[rank] * grade);
  const base: Arc = {
    cx: reach * 0.1,
    cy: 0,
    radius: reach,
    squash: 0.9,
    from: FROM,
    to: TO,
    width: WIDTH_BY_RANK[rank] * grade,
  };
  const arc = sweep(base, progress);
  drawBand(arc, kit.look.ramp, fade);
  if (rank >= 1) {
    const count = MOTIFS + rank * 3;
    for (let i = 0; i < count; i++) {
      const a = arc.from + ((arc.to - arc.from) * (i + 0.5)) / count;
      const [x, y] = arcPoint(arc, a, 1);
      kit.motif(x, y, a, 3 + rank * 2, fade, rank);
    }
  }
  if (rank >= 2) {
    const cross = sweep({ ...base, radius: reach * 0.85, squash: -0.9, width: base.width * 0.8 }, progress * 0.9);
    drawBand(cross, kit.look.ramp, fade);
  }
  if (cast.fillsScreen) {
    const open = ease.outExpo(Math.min(1, progress * 3));
    const far = W * open;
    line(-8, 0, far, 0, kit.look.ramp[4], fade);
    hairline(-8, -0.5, far, -0.5, kit.look.ramp[5], fade);
    glowLine(0, 0, far, 0, 8, kit.look.ramp[3], 0.2 * fade);
  }
};
