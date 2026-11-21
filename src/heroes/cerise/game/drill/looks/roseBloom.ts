import { SPELL_IMPACT_TIME } from "../../../../../drill";
import { disc, ellipseRing, glow, hairline, place, polygon } from "../../../../../engine/frame";
import type { ElementImpact, ElementProjectile } from "../../../../../types/drill";
import { clamp, ease, smooth, TAU } from "../../../../../utils/math";

const LEAF = 0x6fae7a;

export function drawRoseBloomBolt({ spell, x, y, face, distance }: ElementProjectile): void {
  const { color, core } = spell;
  const turn = distance * 0.12;
  place(x, y, face < 0);
  glow(0, 0, 13, color, 0.5);
  ellipseRing(0, 0, 6, 6, color, 0.95);
  ellipseRing(0, 0, 3.5, 3.5, LEAF, 0.85);
  for (let i = 0; i < 6; i++) {
    const a = turn + (i / 6) * TAU;
    const x0 = Math.cos(a) * 6;
    const y0 = Math.sin(a) * 6;
    polygon(
      [
        [x0 + Math.cos(a + 1.4) * 1.5, y0 + Math.sin(a + 1.4) * 1.5],
        [Math.cos(a + 0.25) * 10, Math.sin(a + 0.25) * 10],
        [x0 - Math.cos(a + 1.4) * 1.5, y0 - Math.sin(a + 1.4) * 1.5],
      ],
      i % 2 ? core : color,
    );
  }
  disc(0, 0, 2, core, 1);
  for (let i = 1; i < 4; i++) {
    hairline(-6 - i * 4, Math.sin(turn + i) * 2, -10 - i * 4, Math.sin(turn + i + 1) * 2, LEAF, 0.7 - i * 0.15);
  }
  place();
}

export function drawRoseBloomBlast({ spell, x, y, face, age, fromSword }: ElementImpact): void {
  const { color, core, radius } = spell;
  const u = clamp(age / SPELL_IMPACT_TIME);
  const grow = ease.outBack(clamp(u * 2));
  const fade = 1 - smooth(0.45, 1, u);
  const width = radius * (fromSword ? 0.6 : 1);
  place(x, y + 8, face < 0);
  ellipseRing(0, 0, width, 3, LEAF, fade * 0.8);
  glow(0, -6, width, color, 0.45 * fade);
  const count = fromSword ? 4 : 7;
  for (let i = 0; i < count; i++) {
    const bx = ((i / (count - 1)) * 2 - 1) * width * 0.9;
    const h = (12 + ((i * 7) % 9)) * grow * (fromSword ? 0.7 : 1);
    const lean = (i % 2 ? 1 : -1) * 3;
    polygon(
      [
        [bx - 2, 0],
        [bx + lean * 0.5, -h * 0.55],
        [bx + lean, -h],
        [bx + 2, 0],
      ],
      i % 2 ? color : LEAF,
      fade,
    );
    hairline(bx + lean * 0.3, -h * 0.4, bx + lean * 0.3 + 3, -h * 0.4 - 2, core, fade);
  }
  place();
}
