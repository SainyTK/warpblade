import { disc, ellipseRing, glow, glowLine, place } from "../../../../../engine/frame";
import type { ElementImpact } from "../../../../../types/drill";
import { WHITE } from "../../../../../utils/color";
import { clamp, ease, smooth } from "../../../../../utils/math";
import { INK_RAMP } from "../../../look/ramp";

const IMPACT_TIME = 0.46;

export function drawStillWaterImpact({ spell, x, y, face, age, fromSword }: ElementImpact): void {
  place(x, y, face < 0);
  const progress = clamp(age / IMPACT_TIME);
  const fade = 1 - smooth(0.3, 1, progress);
  const radius = spell.radius * (fromSword ? 0.6 : 1);
  if (!fromSword && age < spell.delay) {
    glow(0, -14, 8, spell.core, smooth(0, spell.delay, age));
    place();
    return;
  }
  glow(0, -10, radius * 0.8, spell.color, 0.45 * fade);
  for (let i = 0; i < 3; i++) {
    const wave = clamp(ease.outCubic(progress) - i * 0.18);
    if (wave > 0) {
      ellipseRing(0, -1, radius * wave, radius * wave * 0.2, i === 0 ? WHITE : INK_RAMP[5], fade * (1 - i * 0.25));
    }
  }
  glowLine(0, -1, 0, -radius * 0.9 * (1 - progress), 3, spell.core, 0.6 * fade);
  disc(0, -1, 2.4 * (1 - progress), WHITE, fade);
  place();
}
