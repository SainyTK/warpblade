import { disc, ellipseRing, glow, hairline, line, place, polygon } from "../../../../../engine/frame";
import type { ElementImpact, ElementProjectile } from "../../../../../types/drill";
import { WHITE } from "../../../../../utils/color";
import { clamp, ease, smooth } from "../../../../../utils/math";
import { INK_RAMP } from "../../../look/ramp";

const IMPACT_TIME = 0.38;

export function drawCrescentBolt({ spell, x, y, face, distance }: ElementProjectile): void {
  place(x, y, face < 0);
  const wobble = Math.sin(distance * 0.2) * 1.2;
  glow(0, 0, 18, spell.color, 0.5);
  const outer: [number, number][] = [];
  const inner: [number, number][] = [];
  for (let i = 0; i <= 8; i++) {
    const a = -1.25 + (i / 8) * 2.5;
    outer.push([Math.cos(a) * 9 - 3, Math.sin(a) * 15 + wobble * (i / 8)]);
    inner.push([Math.cos(a) * 4 - 5, Math.sin(a) * 11]);
  }
  polygon([...outer, ...inner.reverse()], INK_RAMP[3]);
  for (let i = 1; i < outer.length; i++) {
    line(outer[i - 1][0], outer[i - 1][1], outer[i][0], outer[i][1], WHITE, 0.95);
  }
  for (let i = 0; i < 4; i++) {
    const tail = -10 - i * 5;
    hairline(tail, -8 + i * 5, tail - 7, -8 + i * 5 + wobble, INK_RAMP[4], 0.7 - i * 0.12);
  }
  disc(4, 0, 1.6, spell.core, 0.9);
  place();
}

export function drawCrescentImpact({ spell, x, y, face, age, fromSword }: ElementImpact): void {
  place(x, y, face < 0);
  const progress = clamp(age / IMPACT_TIME);
  const fade = 1 - smooth(0.15, 1, progress);
  const size = (fromSword ? 9 : 14) + ease.outCubic(progress) * spell.radius;
  glow(0, 0, size + 6, spell.color, 0.6 * fade);
  ellipseRing(0, 0, size, size * 0.55, INK_RAMP[4], fade);
  for (let i = 0; i < 3; i++) {
    const tilt = -0.5 + i * 0.5;
    const c = Math.cos(tilt) * size;
    const s = Math.sin(tilt) * size;
    line(-c, -s, c, s, INK_RAMP[2], fade);
    hairline(-c, -s - 1, c, s - 1, WHITE, fade);
  }
  place();
}
