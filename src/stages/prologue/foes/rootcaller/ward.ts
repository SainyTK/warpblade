import type { SpriteCanvas } from "../../../../engine/sprite";
import { ROOTCALLER_COLORS as C } from "./colors";

const BACK = [-9, -5, 6] as const;
const FRONT = [-7, -2, 3, 8] as const;

function strands(s: SpriteCanvas, xs: readonly number[], rise: number, time: number, near: boolean): void {
  const top = -30 * rise;
  const base = near ? C.root[2] : C.root[1];
  s.begin();
  xs.forEach((x, i) => {
    const curl = (i % 2 ? 1 : -1) * (1.5 + Math.sin(time * 3 + i) * 0.4);
    const h = top * (0.75 + (i % 3) * 0.12);
    s.taper(x * 1.1, 1, x * 0.6 + curl, h, 1.6, 0.4, base, curl);
  });
  s.shadeEdges(base, near ? C.root[3] : C.root[2], C.root[0]);
  for (const x of xs) s.set(x * 0.6, top * 0.6, near ? C.moss[3] : C.moss[2]);
  s.commit();
}

export function drawWardBack(s: SpriteCanvas, rise: number, time: number): void {
  if (rise > 0.05) strands(s, BACK, rise, time, false);
}

export function drawWardFront(s: SpriteCanvas, rise: number, time: number): void {
  if (rise > 0.05) strands(s, FRONT, rise, time, true);
}
