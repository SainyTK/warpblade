import { SPELL_IMPACT_TIME } from "../../../drill";
import { disc, ellipseRing, fleck, glow, place, px } from "../../../engine/frame";
import type { ElementImpact } from "../../../types/drill";
import { clamp, ease, TAU } from "../../../utils/math";
import { FOE } from "../foes/colors";

const DROPS = 12;

export function drawTideImpact(impact: ElementImpact): void {
  const { x, y, age, spell, face, fromSword } = impact;
  const k = clamp(age / SPELL_IMPACT_TIME);
  const fade = 1 - k;
  const reach = spell.radius * (fromSword ? 0.6 : 1) * ease.outCubic(k);
  place(x, y, face < 0);
  disc(0, 0, 6 * fade + 2, FOE.ink[2], 0.85 * fade);
  ellipseRing(0, 1, reach, reach * 0.45, FOE.inkSheen, fade);
  ellipseRing(0, 1, reach * 0.7, reach * 0.3, FOE.letter, fade * 0.7);
  for (let i = 0; i < DROPS; i++) {
    const a = (i / DROPS) * TAU + 0.3;
    const r = reach * (0.6 + (i % 3) * 0.2);
    const dx = Math.cos(a) * r;
    const dy = Math.sin(a) * r * 0.7 - Math.sin(k * Math.PI) * 6;
    if (i % 3 === 0) {
      fleck(dx, dy, FOE.letterHot, fade);
      fleck(dx + 0.5, dy + 0.5, FOE.letter, fade);
    } else px(dx, dy, i % 2 ? FOE.ink[3] : FOE.inkSheen, fade);
  }
  glow(0, 0, reach + 10, FOE.inkSheen, 0.5 * fade);
  glow(0, 0, 10, FOE.letter, 0.4 * fade);
  place();
}
