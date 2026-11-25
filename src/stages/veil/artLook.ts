import { SPELL_IMPACT_TIME } from "../../drill/constants";
import { ellipseRing, fleck, glow, glowLine, hairline, line, place, polygon, sparkle } from "../../engine/frame";
import type { ElementImpact, ElementProjectile } from "../../types/drill";
import type { Effect } from "../../types/effect";
import { hex } from "../../utils/color";
import { clamp, ease, TAU } from "../../utils/math";

export const LANCE = {
  deep: hex("#3a1a70"),
  dark: hex("#7a4ad8"),
  base: hex("#c39bff"),
  light: hex("#eadcff"),
  core: hex("#fff3a6"),
} as const;

const JAG = [0, -1.5, 1.2, -0.8, 1.6, -1.2, 0.6] as const;

export function drawLanceBolt({ x, y, face, distance }: ElementProjectile): void {
  place(x, y, face < 0);
  const flick = Math.floor(distance / 7) % 2 ? 1 : -1;
  for (let i = 1; i < JAG.length; i++) {
    const x0 = 6 - (i - 1) * 4;
    const x1 = 6 - i * 4;
    const y0 = JAG[i - 1] * flick;
    const y1 = JAG[i] * flick;
    line(x0, y0, x1, y1, i < 3 ? LANCE.base : LANCE.dark);
    hairline(x0, y0, x1, y1, i < 4 ? LANCE.core : LANCE.light);
  }
  polygon(
    [
      [10, 0],
      [4, -2.2],
      [5, 0],
      [4, 2.2],
    ],
    LANCE.light,
  );
  fleck(9, 0, LANCE.core);
  hairline(2, -1, -1, -5 * flick, LANCE.base, 0.7);
  hairline(-8, 1, -11, 4 * flick, LANCE.base, 0.6);
  glowLine(8, 0, -18, 0, 7, LANCE.base, 0.5);
  glow(6, 0, 10, LANCE.core, 0.3);
  place();
}

export function drawLanceImpact({ x, y, face, age, fromSword, spell }: ElementImpact): void {
  const p = clamp(age / SPELL_IMPACT_TIME);
  const fade = 1 - ease.outQuad(p);
  const size = (fromSword ? 0.55 : 1) * (spell.radius / 22);
  place(x, y, face < 0);
  const tear = (1 - p) * 9 * size;
  polygon(
    [
      [0, -tear * 1.4],
      [tear * 0.25, 0],
      [0, tear * 1.4],
      [-tear * 0.25, 0],
    ],
    LANCE.deep,
    fade,
  );
  hairline(0, -tear * 1.3, 0, tear * 1.3, LANCE.core, fade);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU + 0.2;
    const r = (6 + ease.outCubic(p) * 16) * size;
    const mx = Math.cos(a + 0.35) * r * 0.55;
    const my = Math.sin(a + 0.35) * r * 0.55;
    hairline(0, 0, mx, my, LANCE.light, fade);
    hairline(mx, my, Math.cos(a) * r, Math.sin(a) * r, i % 2 ? LANCE.base : LANCE.core, fade);
  }
  ellipseRing(0, 0, (4 + p * 18) * size, (4 + p * 18) * size * 0.7, LANCE.base, fade * 0.8);
  sparkle(0, 0, 4 + p * 6 * size, LANCE.base, LANCE.core, fade);
  glow(0, 0, (16 + p * 10) * size, LANCE.base, 0.7 * fade);
  place();
}

const ARC_LIFE = 0.2;

export function createLanceArc(x0: number, y0: number, x1: number, y1: number): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return t < ARC_LIFE;
    },
    draw() {
      place();
      const fade = 1 - t / ARC_LIFE;
      const steps = 5;
      let px = x0;
      let py = y0;
      for (let i = 1; i <= steps; i++) {
        const k = i / steps;
        const nx = x0 + (x1 - x0) * k + (i < steps ? Math.sin(t * 90 + i * 2.1) * 3 : 0);
        const ny = y0 + (y1 - y0) * k + (i < steps ? Math.cos(t * 70 + i * 1.7) * 3 : 0);
        line(px, py, nx, ny, LANCE.base, fade);
        hairline(px, py, nx, ny, LANCE.core, fade);
        px = nx;
        py = ny;
      }
      glowLine(x0, y0, x1, y1, 6, LANCE.base, 0.4 * fade);
    },
  };
}
