import { W } from "../../../constants/stage";
import { glowLine, line } from "../../../engine/frame";
import type { FxShapeDraw } from "../../../types/skillFx";
import { grain } from "../../../utils/grain";
import { ease, smooth } from "../../../utils/math";

const SPACING = 5;
const TALLEST = 26;

export const drawWave: FxShapeDraw = (cast, at, kit, progress, fade) => {
  const rank = cast.feel.rank;
  const R = kit.look.ramp;
  const reach = cast.fillsScreen ? W : (at.reach ?? 60) * cast.size;
  const front = reach * ease.outCubic(progress);
  const tall = Math.min(TALLEST, (7 + rank * 3) * cast.size) * (1 - smooth(0.6, 1, progress) * 0.6);
  const tail = Math.max(0, front - (24 + rank * 16) * cast.size);
  line(tail, 0, front, 0, R[3], fade);
  glowLine(tail, -2, front, -2, 4 + tall * 0.5, R[3], 0.18 * fade);
  for (let x = front; x > tail; x -= SPACING) {
    const v = (x - tail) / Math.max(1, front - tail);
    const h = tall * v * (0.7 + 0.3 * grain(Math.floor(x / SPACING), rank));
    kit.motif(x, 0, -Math.PI / 2 + 0.25, h, fade * (0.4 + 0.6 * v), rank);
  }
  if (rank >= 1) {
    const back = front - 10 * cast.size;
    if (back > 0) kit.motif(back, 0, -Math.PI / 2 - 0.3, tall * 0.7, fade * 0.8, rank);
  }
  if (rank >= 2) {
    kit.motif(front, 0, -Math.PI / 2 + 0.45, tall * 1.5, fade, rank);
    kit.motif(front - 3, 0, -Math.PI / 2 - 0.1, tall * 1.25, fade, rank);
  }
  if (rank >= 3) {
    const echo = front * 0.6;
    for (let i = 0; i < 3; i++) {
      kit.motif(echo - i * SPACING, 0, -Math.PI / 2 + 0.2 * i, tall * (1.1 - i * 0.2), fade * 0.7, rank);
    }
  }
};
