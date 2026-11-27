import { hairline } from "../../../../engine/frame";
import type { FxShapeDraw } from "../../../../types/skillFx";
import { smooth } from "../../../../utils/math";
import { drawGreatsword } from "./blade";

const LENGTH = [12, 16, 20, 26] as const;
const LEAD = 14;

export const RAM: FxShapeDraw = (cast, at, kit, progress, fade) => {
  const rank = cast.feel.rank;
  const R = kit.look.ramp;
  const face = at.face ?? 1;
  const head = ((at.toX ?? at.x) - at.x) * face + LEAD;
  const length = LENGTH[rank] * (1 + cast.gradeInTier * 0.3);
  const alpha = fade * (1 - smooth(0.5, 1, progress));
  drawGreatsword(kit, head, 0, 0, length, alpha);
  if (rank >= 1) {
    for (const s of [-1, 1]) {
      hairline(head + length * 0.75, 0, head + length * 0.2, s * (4 + rank * 2), R[4], alpha);
    }
  }
  if (rank >= 2) {
    for (let i = 1; i <= rank; i++) {
      const x = head + length * 0.7 + i * 3;
      const h = 4 + rank * 2 + i * 2;
      hairline(x, -h, x + 2, 0, R[3], alpha * 0.8);
      hairline(x + 2, 0, x, h, R[3], alpha * 0.8);
    }
  }
  if (rank >= 3) {
    drawGreatsword(kit, head, -length * 0.35, -0.12, length * 0.8, alpha * 0.5);
    drawGreatsword(kit, head, length * 0.35, 0.12, length * 0.8, alpha * 0.5);
  }
};
