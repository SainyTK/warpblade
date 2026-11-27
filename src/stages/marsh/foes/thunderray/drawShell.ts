import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import { TAU } from "../../../../utils/math";
import { RAY_COLORS as C } from "./colors";

const ARCS = 7;

export function staticShell(s: SpriteCanvas, charge: number, t: number): void {
  const rx = 21 - charge * 3;
  const ry = 15 - charge * 2;
  s.begin();
  for (let i = 0; i < ARCS; i++) {
    const flick = Math.sin(t * 50 + i * 2.1);
    if (flick < 0.6 - charge) continue;
    const a0 = (i / ARCS) * TAU + t * 1.5;
    const span = 0.5 + charge * 0.3;
    let px0 = Math.cos(a0) * rx;
    let py0 = Math.sin(a0) * ry;
    for (let k = 1; k <= 3; k++) {
      const a = a0 + (span * k) / 3;
      const jag = k % 2 ? 1.4 : -1;
      const x = Math.cos(a) * (rx + jag);
      const y = Math.sin(a) * (ry + jag);
      s.hairline(px0, py0, x, y, charge > 0.7 && k === 2 ? WHITE : k === 2 ? C.veinHot : C.vein);
      px0 = x;
      py0 = y;
    }
  }
  s.commit(false);
}
