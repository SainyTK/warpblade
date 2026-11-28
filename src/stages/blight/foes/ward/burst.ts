import { enemyBox } from "../../../../game/enemies/enemy";
import { fxRng, particles } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { TAU } from "../../../../utils/math";
import { BLIGHT } from "../../colors";

export function burstWard(e: Enemy): void {
  const [x0, y0, x1, y1] = enemyBox(e);
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  for (let i = 0; i < 12; i++) {
    const a = fxRng.range(0, TAU);
    const v = fxRng.range(30, 80);
    particles.spawn(PK.MOTE, cx + Math.cos(a) * 6, cy + Math.sin(a) * 6, Math.cos(a) * v, Math.sin(a) * v, 0.45, {
      col: fxRng.pick([BLIGHT.fungus[3], BLIGHT.fungus[4], BLIGHT.bone[3]]),
      size: 0.6,
    });
  }
  sfx.shatter();
}
