import { disc, ellipseRing, glow, hairline, haze, place } from "../../../../../engine/frame";
import type { ElementImpact } from "../../../../../types/drill";
import { WHITE } from "../../../../../utils/color";
import { clamp, smooth } from "../../../../../utils/math";
import { INK_RAMP } from "../../../look/ramp";

const IMPACT_TIME = 0.38;
const CLOUD = 58;
const DROPS = 11;

export function drawInkRainImpact({ spell, x, y, face, age, fromSword }: ElementImpact): void {
  place(x, y, face < 0);
  const width = fromSword ? spell.radius * 0.6 : spell.radius;
  if (!fromSword && age < spell.delay) {
    const gather = smooth(0, spell.delay, age);
    haze(0, -CLOUD, width * gather, 6 * gather, INK_RAMP[2], 0.8 * gather);
    ellipseRing(0, -1, width, 4, spell.color, 0.6 * gather);
    place();
    return;
  }
  const start = fromSword ? 0 : spell.delay;
  const progress = clamp((age - start) / (IMPACT_TIME - start));
  const fade = 1 - smooth(0.4, 1, progress);
  const top = fromSword ? -24 : -CLOUD;
  if (!fromSword) {
    haze(0, top, width, 6, INK_RAMP[2], 0.85 * fade);
    haze(0, top - 2, width * 0.7, 4, INK_RAMP[3], 0.7 * fade);
  }
  for (let i = 0; i < DROPS; i++) {
    const dx = ((i * 37) % 23) / 23;
    const lane = (dx * 2 - 1) * width * 0.9;
    const fall = ((progress * 2.2 + i * 0.13) % 1) * -top;
    const dropY = top + fall;
    hairline(lane, dropY - 6, lane, dropY, i % 3 ? INK_RAMP[4] : WHITE, fade);
    disc(lane, dropY, 1, INK_RAMP[1], fade);
  }
  glow(0, -2, width, spell.color, 0.4 * fade);
  ellipseRing(0, -1, width * (0.6 + progress * 0.5), 3.5, INK_RAMP[4], fade);
  ellipseRing(0, -1, width * (0.3 + progress * 0.4), 2, WHITE, fade * 0.7);
  place();
}
