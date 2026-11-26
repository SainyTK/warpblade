import { SPELL_IMPACT_TIME } from "../../drill/constants";
import { circle, ellipseRing, fleck, glow, hairline, line, place, polygon, px } from "../../engine/frame";
import type { ElementImpact } from "../../types/drill";
import { hex } from "../../utils/color";
import { clamp, ease, smooth } from "../../utils/math";

const GLOAM = {
  outline: hex("#0c0818"),
  brass: hex("#8a6a34"),
  brassLight: hex("#d2a85c"),
  deep: hex("#3a2280"),
  dark: hex("#6a4ad0"),
  base: hex("#9f8cff"),
  light: hex("#d4c8ff"),
  core: hex("#f2eaff"),
} as const;

const HANG = 30;
const TONGUES = 7;

function lantern(lift: number, heat: number, a: number): void {
  const y = -HANG - lift;
  hairline(0, y - 6, 0, y - 12, GLOAM.brassLight, a * 0.6);
  line(-3, y - 5, 3, y - 5, GLOAM.brass, a);
  line(-3, y + 4, 3, y + 4, GLOAM.brass, a);
  line(-3, y - 4, -3, y + 3, GLOAM.brass, a);
  line(3, y - 4, 3, y + 3, GLOAM.brass, a);
  polygon(
    [
      [-2, y - 4],
      [2, y - 4],
      [2, y + 3],
      [-2, y + 3],
    ],
    heat > 0.6 ? GLOAM.light : GLOAM.dark,
    a,
  );
  circle(0, y + 0.5, 1 + heat, GLOAM.core, a);
  fleck(-1.5, y - 3.5, GLOAM.brassLight, a);
  glow(0, y, 10 + heat * 16, GLOAM.base, (0.3 + heat * 0.4) * a);
}

function flames(p: number, size: number, fade: number): void {
  const rise = ease.outCubic(p);
  for (let i = 0; i < TONGUES; i++) {
    const at = ((i - (TONGUES - 1) / 2) / TONGUES) * 26 * size * (0.5 + rise * 0.6);
    const tall = (12 + (i % 3) * 5) * size * (1 - p * 0.7) * rise;
    const sway = Math.sin(p * 18 + i * 1.7) * 1.5;
    polygon(
      [
        [at - 3 * size, 0],
        [at + 3 * size, 0],
        [at + sway, -tall],
      ],
      i % 2 ? GLOAM.dark : GLOAM.base,
      fade,
    );
    hairline(at, -1, at + sway * 0.6, -tall * 0.7, GLOAM.core, fade);
  }
}

export function drawGloamImpact({ x, y, face, age, fromSword, spell }: ElementImpact): void {
  place(x, y, face < 0);
  if (fromSword) {
    const p = clamp(age / SPELL_IMPACT_TIME);
    const fade = 1 - p;
    circle(0, 0, 5 * (1 - p) + 1, GLOAM.base, fade);
    ellipseRing(0, 0, 4 + p * 12, 3 + p * 8, GLOAM.light, fade);
    for (let i = 0; i < 5; i++) px(Math.sin(i * 2.3) * 6, -p * (6 + i * 3), GLOAM.core, fade);
    glow(0, 0, 18, GLOAM.base, 0.5 * fade);
    place();
    return;
  }
  const delay = spell.delay;
  if (age < delay) {
    const k = smooth(0, delay, age);
    lantern(8 * (1 - k), k, k);
    ellipseRing(0, -1, 10 * k, 3 * k, GLOAM.dark, k * 0.7);
    place();
    return;
  }
  const p = clamp((age - delay) / (SPELL_IMPACT_TIME - delay));
  const fade = 1 - ease.outQuad(p);
  const size = spell.radius / 22;
  if (p < 0.35) {
    const drop = ease.outCubic(p / 0.35);
    lantern(-drop * (HANG - 4), 1, 1 - drop);
    line(0, -HANG, 0, -HANG + drop * (HANG - 2), GLOAM.light, 1 - drop * 0.5);
  }
  flames(p, size, fade);
  ellipseRing(0, -1, (6 + ease.outCubic(p) * 22) * size, (2 + p * 4) * size, GLOAM.base, fade);
  ellipseRing(0, -1, (4 + ease.outCubic(p) * 14) * size, (1.5 + p * 2) * size, GLOAM.core, fade * 0.8);
  glow(0, -8, (20 + p * 10) * size, GLOAM.base, 0.7 * fade);
  place();
}
