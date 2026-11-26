import { SPELL_IMPACT_TIME } from "../../../../../drill";
import { disc, glow, hairline, place, polygon, sparkle } from "../../../../../engine/frame";
import type { ElementImpact } from "../../../../../types/drill";
import { clamp, smooth } from "../../../../../utils/math";

const WHITE = 0xffffff;
const THRUSTS = [
  [-2, -0.32],
  [5, 0.22],
  [-6, 0.05],
  [3, -0.12],
  [-4, 0.36],
  [6, -0.26],
  [0, 0.12],
] as const;

export function drawFlurryBlast({ spell, x, y, face, age, fromSword }: ElementImpact): void {
  const { color, core, radius, delay } = spell;
  place(x, y, face < 0);
  if (!fromSword && age < delay) {
    const k = smooth(0, delay, age);
    glow(0, 0, radius * 0.6, color, 0.4 * k);
    place();
    return;
  }
  const start = fromSword ? 0 : delay;
  const u = clamp((age - start) / (SPELL_IMPACT_TIME - start));
  const scale = fromSword ? 0.6 : 1;
  const count = fromSword ? 3 : THRUSTS.length;
  glow(0, 0, radius * scale, color, 0.55 * (1 - u));
  for (let i = 0; i < count; i++) {
    const [dy, tilt] = THRUSTS[i];
    const local = clamp(u * 2.2 - i * 0.16);
    if (local <= 0 || local >= 1) continue;
    const fade = 1 - local;
    const tip = radius * scale * (0.6 + 0.6 * local);
    const tail = tip - 26 * scale;
    const ty = dy * scale + tilt * tip;
    polygon(
      [
        [tail, ty + tilt * (tail - tip) - 1.4],
        [tip, ty],
        [tail, ty + tilt * (tail - tip) + 1.4],
      ],
      color,
      fade,
    );
    hairline(tail + 6, ty + tilt * (tail + 6 - tip), tip, ty, WHITE, fade);
    sparkle(tip, ty, 2.5, core, WHITE, fade);
  }
  for (let i = 0; i < 8; i++) {
    const a = i * 2.4;
    const d = radius * scale * u * (0.6 + (i % 3) * 0.2);
    disc(Math.cos(a) * d, Math.sin(a) * d * 0.7 + u * 6, 1.3, i % 2 ? color : core, 1 - u);
  }
  place();
}
