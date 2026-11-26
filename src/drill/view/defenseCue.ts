import { disc, ellipseRing, glow, hairline, place } from "../../engine/frame";
import type { DefenseCue } from "../../types/drill";
import { TAU } from "../../utils/math";
import { DEFENSE } from "../constants";

const EFFECTS = {
  parry: { edge: 0x92ffdf, core: 0xffffff, reach: 29, rays: 13, strength: 0.92 },
  enhancedParry: { edge: 0xd3a1ff, core: 0xfff0ff, reach: 42, rays: 18, strength: 1 },
  block: { edge: 0x77a9ef, core: 0xc7dfff, reach: 14, rays: 6, strength: 0.53 },
  hit: { edge: 0xff6e56, core: 0xffcd9e, reach: 13, rays: 7, strength: 0.69 },
};

export function drawDefenseCue(cue: DefenseCue | null): void {
  if (!cue) {
    return;
  }
  const { x, y, kind, life } = cue;
  const style = EFFECTS[kind];
  const fade = life / DEFENSE.cueLife;
  const progress = 1 - fade;
  const reach = 6 + style.reach * progress;
  place();
  glow(x, y, style.reach + 8, style.edge, fade * fade * style.strength);
  disc(x, y, 2.75 * fade, style.core, fade);
  if (kind === "block") {
    const shield = 5 + 5 * progress;
    hairline(x, y - shield, x + shield * 0.68, y - shield * 0.55, style.core, fade);
    hairline(x + shield * 0.68, y - shield * 0.55, x + shield * 0.68, y + shield * 0.26, style.edge, fade);
    hairline(x + shield * 0.68, y + shield * 0.26, x, y + shield, style.core, fade);
    hairline(x, y + shield, x - shield * 0.68, y + shield * 0.26, style.core, fade);
    hairline(x - shield * 0.68, y + shield * 0.26, x - shield * 0.68, y - shield * 0.55, style.edge, fade);
    hairline(x - shield * 0.68, y - shield * 0.55, x, y - shield, style.core, fade);
  } else if (kind !== "hit") {
    ellipseRing(x, y, reach, reach * 0.91, style.edge, fade * style.strength);
    const cross = 15 * fade * fade;
    hairline(x - cross, y, x + cross, y, style.core, fade);
    hairline(x, y - cross * 0.75, x, y + cross * 0.75, style.core, fade);
    if (kind === "enhancedParry") {
      ellipseRing(x, y, reach * 0.68, reach * 0.62, style.core, fade * 0.8);
    }
  }
  for (let i = 0; i < style.rays; i++) {
    const angle = (i / style.rays) * TAU + 0.17;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    const length = 4 + (i % 4) * 2;
    const start = reach + (i % 3) * progress * 5;
    hairline(
      x + dx * start,
      y + dy * start,
      x + dx * (start + length * fade),
      y + dy * (start + length * fade),
      i % 3 ? style.edge : style.core,
      fade,
    );
  }
}
