import { ellipseRing, glow, glowLine, place, sparkle } from "../../../../engine/frame";
import type { SkillCast } from "../../../../types/drill";
import { WHITE } from "../../../../utils/color";
import { clamp, ease, smooth } from "../../../../utils/math";
import { JADE } from "../../look";
import { drawSpiritSword } from "../art/spiritSword";

interface RainLayout {
  swords: number;
  length: number;
  around: boolean;
  height: number;
}

const FALL_TIME = 0.22;

const LAYOUTS: Readonly<Record<SkillCast["tier"]["level"], RainLayout>> = {
  1: { swords: 1, length: 30, around: false, height: 70 },
  2: { swords: 5, length: 18, around: false, height: 80 },
  3: { swords: 8, length: 18, around: true, height: 90 },
  4: { swords: 16, length: 20, around: true, height: 110 },
};

function landingOf(cast: SkillCast, layout: RainLayout, i: number): number {
  const { reach } = cast.tier;
  if (layout.swords === 1) {
    return cast.face * reach * 0.55;
  }
  const side = layout.around ? (i % 2 ? -1 : 1) : 1;
  const slot = layout.around ? Math.floor(i / 2) : i;
  const slots = layout.around ? Math.ceil(layout.swords / 2) : layout.swords;
  return cast.face * side * (14 + (reach - 14) * ((slot + 0.5) / slots));
}

export function drawJadeRain(cast: SkillCast, progress: number, fade: number): void {
  const layout = LAYOUTS[cast.tier.level];
  const { x, y, tier } = cast;
  place(x, y);
  glow(0, -24, 30 + tier.level * 10, tier.color, 0.5 * fade);
  ellipseRing(0, -3, tier.reach * ease.outCubic(smooth(0, 0.4, progress)), 6, tier.color, 0.7 * fade);
  place();
  for (let i = 0; i < layout.swords; i++) {
    const start = (i / layout.swords) * 0.4;
    const fall = clamp((progress - start) / FALL_TIME);
    if (fall <= 0) {
      continue;
    }
    const landX = x + landingOf(cast, layout, i);
    const lean = (i % 3) - 1;
    const drop = fall * fall * fall;
    const tipX = landX - lean * 8 * (1 - drop);
    const tipY = y - layout.height * (1 - drop) - 1;
    if (fall < 1) {
      place();
      glowLine(tipX + lean * 8, tipY - layout.height * 0.3, tipX, tipY, 3, JADE[3], 0.5);
    }
    drawSpiritSword(tipX, tipY, Math.PI / 2 - lean * 0.12, fade, layout.length);
    if (fall === 1 && progress - start - FALL_TIME < 0.12) {
      place(landX, y - 3);
      sparkle(0, 0, 6 + tier.level * 2, JADE[4], WHITE, 0.8 * fade);
      ellipseRing(0, 0, 8 + tier.level * 3, 2.5, JADE[5], 0.8 * fade);
      place();
    }
  }
}
