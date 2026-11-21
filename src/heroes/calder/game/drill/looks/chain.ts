import { SPELL_IMPACT_TIME } from "../../../../../drill";
import { circle, disc, glow, hairline, place } from "../../../../../engine/frame";
import type { ElementImpact, ElementProjectile } from "../../../../../types/drill";
import { clamp, smooth, TAU } from "../../../../../utils/math";

const IRON = 0x3e4448;

export function drawChainBolt({ spell, x, y, face, distance }: ElementProjectile): void {
  place(x, y, face < 0);
  const a = distance * 0.28;
  const dx = Math.cos(a) * 6;
  const dy = Math.sin(a) * 6;
  glow(0, 0, 14, spell.color, 0.45);
  hairline(-14, 0, -4, 0, spell.color, (t) => t * 0.6);
  for (let i = 0; i <= 4; i++) {
    const t = i / 4;
    circle(-dx + 2 * dx * t, -dy + 2 * dy * t, 1, spell.color, 0.9);
  }
  disc(-dx, -dy, 2.6, IRON, 1);
  disc(dx, dy, 2.6, IRON, 1);
  disc(-dx - 0.6, -dy - 0.8, 1, spell.core, 1);
  disc(dx - 0.6, dy - 0.8, 1, spell.core, 1);
  place();
}

export function drawChainBlast({ spell, x, y, face, age, fromSword }: ElementImpact): void {
  const u = clamp(age / SPELL_IMPACT_TIME);
  const fade = 1 - smooth(0.15, 1, u);
  const r = spell.radius * (fromSword ? 0.6 : 1) * (0.4 + 0.6 * u);
  place(x, y, face < 0);
  glow(0, 0, 10 + r, spell.color, 0.6 * fade);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU + u * 2.4;
    const ex = Math.cos(a) * r;
    const ey = Math.sin(a) * r * 0.7;
    hairline(0, 0, ex, ey, spell.color, fade);
    circle(ex, ey, 1.6, spell.core, fade);
    hairline(ex, ey, ex + Math.cos(a + 1.2) * 4, ey + Math.sin(a + 1.2) * 4, 0xffffff, fade * 0.8);
  }
  disc(0, 0, 4 * (1 - u), 0xffffff, fade);
  place();
}
