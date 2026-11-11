import type { SpriteCanvas } from "../../../engine/sprite";
import { cb, cg, cr, mix } from "../../../utils/color";
import { AC } from "./colors";

/** pixels brighter than this are bone, eyes or void light and keep their own colour under the rim */
export const DARK_BELOW = 240;
/** how strongly the rim tints the edge pixel, the pixel under it, and the sun side's silhouette */
const STRENGTH = { edge: 1, under: 0.45, side: 0.55 } as const;

const changed: number[] = [];
const tones: number[] = [];

/**
 * The black sun's crimson light on the dark parts of a finished drawing, before it is mirrored: the top edge of every
 * shape takes the rim colour, hot on the canvas's left half where the sun is and soft on the right, the image pixel
 * row under it fades into the plate, and the silhouette's left edge takes a softer rim. Bright parts keep their own
 * colour, so the blade, the crown and the eyes stay clean.
 */
export function sovereignRim(s: SpriteCanvas): void {
  const { w, d, box } = s;
  if (box.x1 < box.x0) return;
  changed.length = 0;
  tones.length = 0;
  for (let y = Math.max(2, box.y0); y <= box.y1; y++)
    for (let x = Math.max(1, box.x0), i = y * w + x; x <= box.x1; x++, i++) {
      const c = d[i];
      if (!c || cr(c) + cg(c) + cb(c) >= DARK_BELOW) continue;
      const sunward = x < s.ox;
      let to = 0;
      if (!d[i - w]) to = mix(c, sunward ? AC.rim : AC.rimSoft, STRENGTH.edge);
      else if (!d[i - 2 * w]) to = mix(c, sunward ? AC.rim : AC.rimSoft, STRENGTH.under);
      else if (sunward && !d[i - 1]) to = mix(c, AC.rimSoft, STRENGTH.side);
      if (!to) continue;
      changed.push(i);
      tones.push(to);
    }
  for (let k = 0; k < changed.length; k++) d[changed[k]] = tones[k];
}
