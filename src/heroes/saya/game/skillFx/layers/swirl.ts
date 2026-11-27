import { fleck, line } from "../../../../../engine/frame";
import { smooth, TAU } from "../../../../../utils/math";
import type { SayaLayerDraw } from "../../../types/skillFx";

const ARMS = [1, 1, 2, 3] as const;
const STEPS = 18;

export const drawSwirlLayer: SayaLayerDraw = (cast, kit, progress, fade, center) => {
  const rank = cast.feel.rank;
  const R = kit.look.ramp;
  const s = Math.sqrt(cast.size);
  const reach = (8 + rank * 4) * s * smooth(0, 0.35, progress);
  const alpha = fade * (1 - smooth(0.6, 1, progress));
  const arms = ARMS[rank];
  for (let arm = 0; arm < arms; arm++) {
    const turn = (arm / arms) * TAU + progress * 6;
    let px = center.x;
    let py = center.y;
    for (let i = 1; i <= STEPS; i++) {
      const v = i / STEPS;
      const a = turn + v * TAU * 1.2;
      const x = center.x + Math.cos(a) * reach * v;
      const y = center.y + Math.sin(a) * reach * v * 0.7;
      line(px, py, x, y, i % 3 ? kit.look.dark : R[3], alpha * (0.4 + 0.6 * v));
      px = x;
      py = y;
    }
    fleck(px, py, R[5], alpha);
  }
};
