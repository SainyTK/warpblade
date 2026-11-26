import { SPELL_IMPACT_TIME } from "../../drill/constants";
import { circle, disc, ellipseRing, fleck, glow, hairline, place, px } from "../../engine/frame";
import type { ElementImpact, ElementProjectile } from "../../types/drill";
import { hex } from "../../utils/color";
import { clamp, ease, TAU } from "../../utils/math";

export const MIRE = {
  outline: hex("#10180a"),
  deep: hex("#2c4a14"),
  dark: hex("#4a7a1e"),
  base: hex("#8fd14f"),
  light: hex("#c8f080"),
  core: hex("#e8ffb0"),
  mud: hex("#4a3a2a"),
  rot: hex("#9a6ad8"),
} as const;

const DROPS = 9;

export function drawMireBolt({ x, y, face, distance }: ElementProjectile): void {
  place(x, y, face < 0);
  const wob = Math.sin(distance * 0.3) * 0.5;
  for (let i = 1; i <= 4; i++) {
    const tx = -i * 3.5;
    const ty = Math.sin(distance * 0.2 + i) * 0.8 + i * 0.6;
    circle(tx, ty, 1.6 - i * 0.3, i % 2 ? MIRE.dark : MIRE.deep);
  }
  hairline(-3, 1.5, -12, 3 + wob, MIRE.deep);
  circle(0, 0, 4.2 + wob * 0.4, MIRE.outline);
  circle(0, 0, 3.6 + wob * 0.4, MIRE.dark);
  circle(-0.4, -0.6, 2.7, MIRE.base);
  circle(-1, -1.2, 1.4, MIRE.light);
  fleck(-1.6, -1.9, MIRE.core);
  fleck(-1.1, -1.9, MIRE.core);
  px(1.5, 1, MIRE.mud);
  fleck(2, -1, MIRE.rot);
  px(1 + wob, 3.6, MIRE.dark);
  fleck(1 + wob, 4.6, MIRE.base);
  glow(0, 0, 14, MIRE.base, 0.45);
  place();
}

export function drawMireImpact({ x, y, face, age, fromSword }: ElementImpact): void {
  const p = clamp(age / SPELL_IMPACT_TIME);
  const fade = 1 - ease.outQuad(p);
  const size = fromSword ? 0.55 : 1;
  place(x, y, face < 0);
  disc(0, 0, (6 + p * 14) * size, MIRE.deep, 0.35 * fade);
  ellipseRing(0, 1, (5 + ease.outCubic(p) * 20) * size, (3 + p * 10) * size, MIRE.base, fade);
  circle(0, 0, 4.5 * (1 - p) * size + 0.5, MIRE.light, fade);
  for (let i = 0; i < DROPS; i++) {
    const a = (i / DROPS) * TAU + 0.3;
    const speed = (14 + (i % 3) * 6) * size;
    const dx = Math.cos(a) * speed * p * 1.4;
    const dy = Math.sin(a) * speed * p - 10 * p + 26 * p * p;
    circle(dx, dy, (1.6 - p) * size + 0.4, i % 3 ? MIRE.base : MIRE.dark, fade);
    fleck(dx - 0.5, dy - 0.5, MIRE.core, fade);
  }
  for (let i = 0; i < 4; i++) {
    const bx = Math.sin(i * 2.7) * 8 * size;
    const by = -p * (8 + i * 3) * size;
    ellipseRing(bx, by, 1.4, 1.4, MIRE.light, fade * 0.8);
  }
  glow(0, 0, (16 + p * 10) * size, MIRE.base, 0.6 * fade);
  place();
}
