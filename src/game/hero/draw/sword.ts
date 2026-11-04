import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { WHITE } from "../../../utils/color";
import { skin } from "../skin";
import type { Vec } from "./reach";

/** the crystal sword in the hand at this angle: pommel, hilt, guard, then the blade with a white tip */
function drawBlade(s: SpriteCanvas, hand: Vec, ca: number, sn: number): void {
  const [hx, hy] = hand;
  const L = skin.reach;
  s.dot(hx - ca * 3, hy - sn * 3, 0.8, HC.trim);
  s.stroke(hx - ca * 2.4, hy - sn * 2.4, hx + ca, hy + sn, 0.6, HC.hilt);
  const gx = hx + ca * 1.7;
  const gy = hy + sn * 1.7;
  s.stroke(gx - sn * 2.6, gy + ca * 2.6, gx + sn * 2.6, gy - ca * 2.6, 0.62, HC.trim);
  for (let d = 2.6; d <= L; d += 0.5) {
    const x = hx + ca * d;
    const y = hy + sn * d;
    if (d > L - 2) {
      s.set(x, y, WHITE);
      continue;
    }
    s.set(x, y, HC.blade);
    s.set(x - sn * 0.95, y + ca * 0.95, d < 4 ? HC.bladeBack : HC.bladeEdge);
  }
}

/** a glaive: a long dark haft through the hand with a bronze butt cap, a collar, then a curved blade of forge-fire */
function drawGlaive(s: SpriteCanvas, hand: Vec, ca: number, sn: number): void {
  const [hx, hy] = hand;
  const L = skin.reach;
  const head = 8;
  const neck = L - head;
  s.stroke(hx - ca * 7, hy - sn * 7, hx + ca * neck, hy + sn * neck, 0.55, HC.hilt);
  s.dot(hx - ca * 7.5, hy - sn * 7.5, 0.7, HC.trim);
  const cx = hx + ca * neck;
  const cy = hy + sn * neck;
  s.stroke(cx - sn * 1.6, cy + ca * 1.6, cx + sn * 1.6, cy - ca * 1.6, 0.6, HC.trim);
  for (let d = 0.5; d <= head; d += 0.4) {
    const u = d / head;
    // the blade swells on its edge side and sweeps back to a hooked point
    const bulge = Math.sin(Math.PI * Math.min(1, u * 1.15)) * 2.2;
    const x = cx + ca * d;
    const y = cy + sn * d;
    if (u > 0.85) {
      s.set(x - sn * bulge * 0.5, y + ca * bulge * 0.5, WHITE);
      continue;
    }
    s.set(x, y, HC.bladeBack);
    for (let w = 0.9; w <= bulge; w += 0.8) s.set(x - sn * w, y + ca * w, HC.blade);
    s.set(x - sn * (bulge + 0.6), y + ca * (bulge + 0.6), HC.bladeEdge);
  }
}

/** the hero's weapon in the hand at this angle */
export function drawSword(s: SpriteCanvas, hand: Vec, angle: number): void {
  const ca = Math.cos(angle);
  const sn = Math.sin(angle);
  s.begin();
  if (skin.weapon === "glaive") drawGlaive(s, hand, ca, sn);
  else drawBlade(s, hand, ca, sn);
  s.commit();
}
