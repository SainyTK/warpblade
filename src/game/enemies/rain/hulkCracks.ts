import type { SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";
import { mix, WHITE } from "../../../utils/color";
import { RAIN_FOES as C } from "./colors";
import type { Point } from "./hulkLook";

export type Crack = readonly Point[];

const WIDTH = { edge: 1.25, body: 1, core: 0.5 } as const;

function along(s: SpriteCanvas, crack: Crack, r: number, c: Color, dy: number): void {
  for (let i = 1; i < crack.length; i++) {
    const [x0, y0] = crack[i - 1];
    const [x1, y1] = crack[i];
    s.stroke(x0, y0 + dy, x1, y1 + dy, r, c);
  }
}

export function drawCracks(s: SpriteCanvas, cracks: readonly Crack[], flare: number, dy = 0): void {
  const body = mix(C.kiteVein, C.wartHot, flare);
  const core = mix(C.veinHot, WHITE, flare);
  for (const crack of cracks) along(s, crack, WIDTH.edge, C.veinDeep, dy);
  for (const crack of cracks) along(s, crack, WIDTH.body, body, dy);
  for (const crack of cracks) along(s, crack, WIDTH.core, core, dy);
}
