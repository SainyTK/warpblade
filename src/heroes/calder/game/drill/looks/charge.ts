import { SPELL_IMPACT_TIME } from "../../../../../drill";
import { disc, ellipseRing, glow, hairline, place, polygon } from "../../../../../engine/frame";
import type { ElementImpact, ElementProjectile } from "../../../../../types/drill";
import { clamp, ease, smooth, TAU } from "../../../../../utils/math";

const CASE = 0x5c3e28;

function charge(color: number, blink: boolean): void {
  polygon(
    [
      [-3, -3],
      [3, -3],
      [3, 3],
      [-3, 3],
    ],
    CASE,
  );
  hairline(-3, 0, 3, 0, 0x2a1c08);
  disc(0, -4, 1.4, blink ? 0xffffff : color, 1);
  if (blink) {
    glow(0, -4, 9, color, 0.8);
  }
}

export function drawChargeBolt({ spell, x, y, face, distance }: ElementProjectile): void {
  place(x, y, face < 0);
  charge(spell.color, Math.floor(distance / 10) % 2 === 0);
  place();
}

export function drawChargeBlast({ spell, x, y, face, age, fromSword }: ElementImpact): void {
  place(x, y, face < 0);
  const fuse = fromSword ? 0 : spell.delay;
  if (age < fuse) {
    charge(spell.color, Math.floor(age * 22) % 2 === 0);
    ellipseRing(0, 0, 6 + 10 * smooth(0, fuse, age), 3, spell.color, 0.6);
    place();
    return;
  }
  const u = clamp((age - fuse) / (SPELL_IMPACT_TIME - fuse * 0.5));
  const fade = 1 - smooth(0.25, 1, u);
  const r = spell.radius * (fromSword ? 0.6 : 1) * ease.outCubic(u);
  glow(0, -6, 20 + r * 1.3, spell.color, 0.85 * fade);
  disc(0, -6, r * 0.75, spell.color, 0.75 * fade);
  disc(0, -6, r * 0.45, spell.core, fade);
  disc(0, -6, r * 0.2, 0xffffff, fade);
  ellipseRing(0, 1, r * 1.2, r * 0.32, spell.color, fade);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * TAU + 0.3;
    const d = r * (1 + (i % 3) * 0.2);
    hairline(
      Math.cos(a) * r * 0.6,
      -6 + Math.sin(a) * r * 0.5,
      Math.cos(a) * d,
      -6 + Math.sin(a) * d * 0.8,
      0xfff4c0,
      fade,
    );
  }
  place();
}
