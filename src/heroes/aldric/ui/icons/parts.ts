import { BASE_HERO_COLORS as HC, PAL } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { sword } from "../../../../ui/skills/icons/parts";
import { hex, WHITE } from "../../../../utils/color";

/** the blade of his sword in the icons */
const BLADE = hex("#dfe8f8");

import { DAWN_RAMP } from "../../constants/light";

/** Aldric's shapes for his 16 by 16 skill icons */
type S = SpriteCanvas;

/** the kite shield face on, centred at (cx, cy), `h` tall: white enamel in a gold rim, a gold sun with the crystal */
export function kite(s: S, cx: number, cy: number, h: number): void {
  const w = h * 0.4;
  const top = cy - h * 0.45;
  const pts: [number, number][] = [
    [cx - w, top],
    [cx + w, top],
    [cx + w, cy + h * 0.05],
    [cx, cy + h * 0.55],
    [cx - w, cy + h * 0.05],
  ];
  s.begin();
  s.poly(pts, DAWN_RAMP[3]);
  s.commit();
  s.begin();
  s.poly(
    pts.map(([x, y]) => [cx + (x - cx) * 0.62, cy + (y - cy) * 0.66] as [number, number]),
    HC.eyeWhite,
  );
  s.commit(false);
  s.begin();
  s.dot(cx, cy - h * 0.12, Math.max(0.9, h * 0.11), DAWN_RAMP[3]);
  s.commit(false);
  s.begin();
  s.set(cx, cy - h * 0.12, WHITE);
  s.commit(false);
}

/** a steel sword in his colours from the grip at (x0, y0) to the point at (x1, y1) */
export const steelSword = (s: S, x0: number, y0: number, x1: number, y1: number): void =>
  sword(s, x0, y0, x1, y1, BLADE);

/** a beam of dawn light falling from the top of the icon to (x, y) */
export function beam(s: S, x: number, y: number, w: number): void {
  s.begin();
  s.stroke(x, 0, x, y, w, DAWN_RAMP[4]);
  s.commit(false);
  s.begin();
  s.stroke(x, 0, x, y, Math.max(0.3, w * 0.4), WHITE);
  s.commit(false);
}

/** a dome of light over the floor line */
export function dome(s: S, cx: number, base: number, r: number): void {
  s.begin();
  for (let a = 0; a <= Math.PI; a += 0.15) s.set(cx + Math.cos(a) * r, base - Math.sin(a) * r * 0.85, DAWN_RAMP[4]);
  s.stroke(cx - r, base, cx + r, base, 0.4, DAWN_RAMP[3]);
  s.commit(false);
}

/** a shadow foe, a round body with one lit eye */
export function foe(s: S, x: number, y: number, r: number): void {
  s.begin();
  s.dot(x, y, r, PAL.shadow[3]);
  s.commit();
  s.begin();
  s.set(Math.round(x - r * 0.4), Math.round(y - r * 0.3), PAL.shadow[5]);
  s.commit(false);
}

/** the floor line along the bottom, in gold */
export function floor(s: S): void {
  s.begin();
  s.stroke(1, 14.5, 15, 14.5, 0.6, DAWN_RAMP[2]);
  s.commit(false);
}

/** a small knight of light, feet at (x, y) */
export function lightKnight(s: S, x: number, y: number): void {
  s.begin();
  s.dot(x, y - 8, 1.6, DAWN_RAMP[4]);
  s.poly(
    [
      [x - 2.5, y],
      [x + 2.5, y],
      [x + 1.5, y - 6.5],
      [x - 1.5, y - 6.5],
    ],
    DAWN_RAMP[3],
  );
  s.commit();
  s.begin();
  s.stroke(x + 2, y - 6, x + 6, y - 12, 0.4, WHITE);
  s.commit(false);
  s.begin();
  s.poly(
    [
      [x - 4, y - 7],
      [x - 1, y - 7],
      [x - 1, y - 4],
      [x - 2.5, y - 2],
      [x - 4, y - 4],
    ],
    DAWN_RAMP[5],
  );
  s.commit();
}
