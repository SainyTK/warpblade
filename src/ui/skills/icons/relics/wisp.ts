import { PAL } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import { evolvedStar } from "../evolution";
import { fill } from "../parts";

const C = PAL.heal;

/** a wisp: a round glowing head with two dark eyes and a tail curling down and back */
function wispAt(s: SpriteCanvas, x: number, y: number, r: number): void {
  fill(s, () => s.taper(x + r * 0.3, y + r * 0.5, x + r * 1.1, y + r * 2, r * 0.55, 0.3, C[2], -1));
  fill(s, () => {
    s.dot(x, y, r, C[3]);
    s.dot(x - r * 0.35, y - r * 0.4, r * 0.4, C[4]);
    s.set(x - r * 0.45, y + 0.2, C[0]);
    s.set(x + r * 0.45, y + 0.2, C[0]);
  });
}

/** a homing bolt: a curved trail ending in a white seed of light */
function boltTo(s: SpriteCanvas, x0: number, y0: number, x1: number, y1: number): void {
  fill(s, () => {
    s.taper(x0, y0, x1, y1, 0.25, 0.6, C[3], 1.5);
    s.dot(x1, y1, 1.2, C[4]);
    s.set(x1, y1, WHITE);
  });
}

/** Seeker Wisp: one wisp loosing a bolt; Wisp Choir: three wisps */
export const WISP_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  relic_wisp: (s) => {
    boltTo(s, 8, 6, 13, 3.5);
    wispAt(s, 5.5, 8, 3.4);
  },
  relic_wisp_evo: (s) => {
    wispAt(s, 3.5, 10, 2.4);
    wispAt(s, 12.5, 11, 2.4);
    wispAt(s, 7.5, 5.5, 2.6);
    evolvedStar(s);
  },
};
