import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Vec } from "./reach";

/** the ponytail, then the scarf, behind everything else */
export function drawTrails(s: SpriteCanvas, tail: readonly Vec[], scarf: readonly Vec[]): void {
  s.begin();
  for (let i = 1; i < tail.length; i++) {
    const [a, b] = [tail[i - 1], tail[i]];
    s.stroke(a[0], a[1], b[0], b[1], i < 2 ? 1.3 : i < 3 ? 1 : 0.7, i < 2 ? HC.hair : HC.hairDark);
  }
  s.commit(false);
  s.begin();
  for (let i = 1; i < scarf.length; i++) {
    const [a, b] = [scarf[i - 1], scarf[i]];
    s.stroke(a[0], a[1], b[0], b[1], 1.25 - i * 0.07, i % 3 === 2 ? HC.scarfDark : HC.scarf);
  }
  const tip = scarf[scarf.length - 1];
  s.set(tip[0], tip[1] + 1, HC.scarfDark);
  s.commit(false);
}
