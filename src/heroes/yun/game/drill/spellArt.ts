import { disc, ellipseRing, glow, glowLine, hairline, place, sparkle } from "../../../../engine/frame";
import type { ElementImpact, ElementProjectile } from "../../../../types/drill";
import { WHITE } from "../../../../utils/color";
import { clamp, ease, smooth, TAU } from "../../../../utils/math";
import { JADE } from "../../look";
import { drawSpiritSword } from "../art/spiritSword";

const IMPACT_TIME = 0.38;
const STREAM_ROWS = [
  { back: 0, rise: 0 },
  { back: 9, rise: -6 },
  { back: 15, rise: 5 },
] as const;

export function drawStreamBolt({ x, y, face, distance }: ElementProjectile): void {
  place();
  glowLine(x - face * 26, y, x, y, 6, JADE[3], 0.4);
  for (const row of STREAM_ROWS) {
    const wobble = Math.sin(distance * 0.2 + row.back) * 1.2;
    const tipX = x - face * row.back;
    const tipY = y + row.rise + wobble;
    hairline(tipX - face * 30, tipY, tipX - face * 14, tipY, JADE[4], 0.35);
    drawSpiritSword(tipX, tipY, face > 0 ? 0 : Math.PI, 1, 13);
  }
}

export function drawCrescentBolt({ x, y, face, distance }: ElementProjectile): void {
  place(x, y, face < 0);
  glow(0, 0, 18, JADE[3], 0.55);
  const pulse = 1 + Math.sin(distance * 0.3) * 0.06;
  for (let i = 0; i <= 14; i++) {
    const u = i / 14;
    const a = -1.25 + 2.5 * u;
    const r = 13 * pulse;
    const thick = 3.2 * Math.sin(Math.PI * u);
    const cx = Math.cos(a) * r - 9;
    const cy = Math.sin(a) * r * 1.35;
    hairline(cx - thick, cy, cx + 0.6, cy, i % 3 ? JADE[4] : WHITE, 0.95);
  }
  for (let i = 0; i < 4; i++) {
    const py = -12 + i * 8;
    hairline(-14 - i * 2, py, -26 - i * 3, py, JADE[3], 0.5);
  }
  place();
}

export function drawLotusImpact({ x, y, face, age, fromSword }: ElementImpact): void {
  const u = clamp(age / IMPACT_TIME);
  const fade = 1 - smooth(0.55, 1, u);
  const radius = (fromSword ? 13 : 22) * ease.outCubic(smooth(0, 0.35, u));
  const count = fromSword ? 4 : 6;
  const cy = y - 16;
  place(x, y, face < 0);
  glow(0, -16, radius + 8, JADE[3], 0.45 * fade);
  ellipseRing(0, -3, radius, radius * 0.25, JADE[4], 0.8 * fade);
  disc(0, -16, 3 * fade, WHITE, fade);
  place();
  for (let i = 0; i < count; i++) {
    const a = (i / count) * TAU + age * 9;
    const sx = x + Math.cos(a) * radius;
    const sy = cy + Math.sin(a) * radius * 0.45;
    drawSpiritSword(sx, sy, a + Math.PI / 2, fade, 11);
  }
  place(x, cy);
  sparkle(0, 0, 5 + 6 * u, JADE[4], WHITE, 0.6 * fade);
  place();
}
