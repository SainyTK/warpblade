import { DIAL } from "../../../constants/mirel/look";
import { fleck, glow, hairline } from "../../../engine/frame";
import { WHITE } from "../../../utils/color";
import { TAU } from "../../../utils/math";
import { fineRing } from "../../effects/fine";

/**
 * A clock hand in flight along (dx, dy), its point at (x, y): a bright shaft `length` long that thickens toward a small
 * counterweight ring at its tail, a white point, and a fine thread fading out behind it.
 */
export function drawFlyingHand(x: number, y: number, dx: number, dy: number, length: number): void {
  const tx = x - dx * length;
  const ty = y - dy * length;
  hairline(tx - dx * 12, ty - dy * 12, tx, ty, DIAL.handShade, (u) => u * 0.7);
  hairline(tx, ty, x, y, DIAL.hand);
  hairline(tx - dy * 0.5, ty + dx * 0.5, x - dx * length * 0.4, y - dy * length * 0.4, DIAL.handShade);
  fineRing(tx + dx * 1.5, ty + dy * 1.5, 1.5, 1.5, DIAL.hour);
  fleck(x, y, WHITE);
  glow(x, y, 8, DIAL.light, 0.35);
}

/** a small brass gear turned to `turn` radians: a fine rim, six teeth alternately light and dark, a teal heart */
export function drawGearWheel(x: number, y: number, turn: number, rim: number, tooth: number, a: number): void {
  fineRing(x, y, 2, 2, rim, a);
  for (let i = 0; i < 6; i++) {
    const g = turn + (i * TAU) / 6;
    fleck(x + Math.cos(g) * 3, y + Math.sin(g) * 3, i % 2 ? tooth : rim, a);
    fleck(x + Math.cos(g) * 2.5, y + Math.sin(g) * 2.5, i % 2 ? tooth : rim, a);
  }
  fleck(x, y, DIAL.hour, a);
  fleck(x - 0.5, y, DIAL.hand, a);
}
