import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Vec } from "./reach";

/** the ponytail in lit strands, then the scarf with a light top edge and a shadowed underside, behind everything else */
export function drawTrails(s: SpriteCanvas, tail: readonly Vec[], scarf: readonly Vec[]): void {
  s.begin();
  for (let i = 1; i < tail.length; i++) {
    const [a, b] = [tail[i - 1], tail[i]];
    s.stroke(a[0], a[1], b[0], b[1], i < 2 ? 1.4 : i < 3 ? 1.1 : 0.75, HC.hairDark);
  }
  s.shadeEdges(HC.hairDark, HC.hair, HC.hairDeep, 2);
  s.commit(false);
  s.begin();
  for (let i = 1; i < scarf.length; i++) {
    const [a, b] = [scarf[i - 1], scarf[i]];
    s.stroke(a[0], a[1], b[0], b[1], 1.3 - i * 0.07, HC.scarf);
  }
  s.shadeEdges(HC.scarf, HC.scarfLight, HC.scarfDark, 2);
  s.commit(false);
}
