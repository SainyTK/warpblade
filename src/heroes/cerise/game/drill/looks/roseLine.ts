import { SPELL_IMPACT_TIME } from "../../../../../drill";
import { ellipseRing, glow, glowLine, hairline, place, polygon, sparkle } from "../../../../../engine/frame";
import type { ElementImpact, ElementProjectile } from "../../../../../types/drill";
import { clamp, ease, smooth, TAU } from "../../../../../utils/math";

const WHITE = 0xffffff;

export function drawRoseLineBolt({ spell, x, y, face, distance }: ElementProjectile): void {
  const { color, core } = spell;
  place(x, y, face < 0);
  glowLine(-30, 0, 6, 0, 7, color, 0.55);
  polygon(
    [
      [-28, 0],
      [-4, -1.6],
      [9, 0],
      [-4, 1.6],
    ],
    color,
  );
  hairline(-24, 0, 9, 0, core);
  hairline(-10, 0, 10, 0, WHITE);
  for (let i = 0; i < 3; i++) {
    const px = -14 - i * 8;
    const py = Math.sin(distance * 0.21 + i * 2.1) * (2.5 + i);
    polygon(
      [
        [px - 2.5, py],
        [px, py - 1.6],
        [px + 2.5, py],
        [px, py + 1.6],
      ],
      i % 2 ? core : color,
      0.85 - i * 0.2,
    );
  }
  sparkle(9, 0, 3, color, core, 0.7);
  place();
}

export function drawRoseLineBlast({ spell, x, y, face, age, fromSword }: ElementImpact): void {
  const { color, core, radius } = spell;
  const u = clamp(age / SPELL_IMPACT_TIME);
  const fade = 1 - smooth(0.2, 1, u);
  const size = (fromSword ? 0.6 : 1) * radius * (0.4 + 0.6 * ease.outCubic(u));
  place(x, y, face < 0);
  glow(0, 0, 10 + size, color, 0.6 * fade);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * TAU + u * 1.4;
    const tipX = Math.cos(a) * size;
    const tipY = Math.sin(a) * size * 0.85;
    const sideX = Math.cos(a + 0.5) * size * 0.45;
    const sideY = Math.sin(a + 0.5) * size * 0.38;
    polygon(
      [
        [0, 0],
        [sideX, sideY],
        [tipX, tipY],
        [Math.cos(a - 0.5) * size * 0.45, Math.sin(a - 0.5) * size * 0.38],
      ],
      i % 2 ? color : core,
      fade * 0.8,
    );
  }
  hairline(-size * 1.4, 0, size * 1.4, 0, WHITE, fade);
  ellipseRing(0, 0, size * 0.55, size * 0.5, core, fade);
  sparkle(0, 0, 4 + 4 * (1 - u), color, core, fade);
  place();
}
