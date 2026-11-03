import { BODY } from "../../../constants/hero";
import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { WHITE } from "../../../utils/color";
import type { Vec } from "./reach";

/** the crystal sword in the hand at this angle: pommel, hilt, guard, then the blade with a white tip */
export function drawSword(s: SpriteCanvas, hand: Vec, angle: number): void {
  const ca = Math.cos(angle);
  const sn = Math.sin(angle);
  const [hx, hy] = hand;
  s.begin();
  s.dot(hx - ca * 3, hy - sn * 3, 0.8, HC.trim);
  s.stroke(hx - ca * 2.4, hy - sn * 2.4, hx + ca, hy + sn, 0.6, HC.hilt);
  const gx = hx + ca * 1.7;
  const gy = hy + sn * 1.7;
  s.stroke(gx - sn * 2.6, gy + ca * 2.6, gx + sn * 2.6, gy - ca * 2.6, 0.62, HC.trim);
  for (let d = 2.6; d <= BODY.bladeLength; d += 0.5) {
    const x = hx + ca * d;
    const y = hy + sn * d;
    if (d > BODY.bladeLength - 2) {
      s.set(x, y, WHITE);
      continue;
    }
    s.set(x, y, HC.blade);
    s.set(x - sn * 0.95, y + ca * 0.95, d < 4 ? HC.bladeBack : HC.bladeEdge);
  }
  s.commit();
}
