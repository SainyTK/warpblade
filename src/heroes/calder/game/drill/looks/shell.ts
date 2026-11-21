import { SPELL_IMPACT_TIME } from "../../../../../drill";
import { disc, ellipseRing, glow, hairline, place, polygon } from "../../../../../engine/frame";
import type { ElementImpact, ElementProjectile } from "../../../../../types/drill";
import { clamp, ease, smooth, TAU } from "../../../../../utils/math";

const BRASS = 0xf2c440;
const BRASS_DARK = 0x7c5a22;

export function drawShellBolt({ spell, x, y, face, distance }: ElementProjectile): void {
  place(x, y, face < 0);
  glow(-4, 0, 18, spell.color, 0.6);
  for (let i = 0; i < 7; i++) {
    const tx = -6 - i * 3.2;
    const ty = Math.sin(distance * 0.4 + i * 1.3) * (0.6 + i * 0.45);
    disc(tx, ty, 2.6 - i * 0.3, i < 2 ? spell.core : spell.color, 0.9 - i * 0.11);
  }
  const spin = distance * 0.35;
  const s = Math.sin(spin) * 1.2;
  polygon(
    [
      [-3, -2.4 + s * 0.2],
      [3, -2.4],
      [6, 0],
      [3, 2.4],
      [-3, 2.4 - s * 0.2],
    ],
    BRASS,
  );
  hairline(-3, -2.4, -3, 2.4, BRASS_DARK);
  hairline(-1, -1.6, 4, -1.4, 0xfff4c0, 0.9);
  place();
}

export function drawShellBlast({ spell, x, y, face, age, fromSword }: ElementImpact): void {
  const u = clamp(age / SPELL_IMPACT_TIME);
  const fade = 1 - smooth(0.2, 1, u);
  const r = spell.radius * (fromSword ? 0.6 : 1) * (0.35 + 0.65 * ease.outCubic(u));
  place(x, y, face < 0);
  glow(0, -4, 14 + r, spell.color, 0.7 * fade);
  ellipseRing(0, 2, r, r * 0.3, spell.color, fade);
  disc(0, -2, 6 * (1 - u), spell.core, fade);
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * TAU;
    const fx = Math.cos(a) * r * 0.8;
    const h = (8 + ((i * 7) % 9)) * (0.4 + u) * fade;
    polygon(
      [
        [fx - 2.5, 2],
        [fx + Math.sin(age * 30 + i) * 1.5, 2 - h],
        [fx + 2.5, 2],
      ],
      i % 2 ? spell.color : spell.core,
      fade * 0.85,
    );
  }
  place();
}
