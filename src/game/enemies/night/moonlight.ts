import type { SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";
import { cb, cg, cr, mix } from "../../../utils/color";
import { BACK_RIM, MOON_RIM } from "./colors";

/** how strongly the moon's light and the far edge's faint light tint the pixels along the silhouette */
const STRENGTH = { rim: 0.62, inner: 0.26, back: 0.3 };
/** pixels brighter than this are bone, eyes or fire and keep their own color on the far edge */
const DARK_BELOW = 150;

const changed: number[] = [];
const tones: Color[] = [];

/**
 * Light the finished sprite's silhouette: a cool rim along the edge at the canvas's top left, where the moon's light
 * falls, one image pixel wide and a softer second pixel when `deep`, and a faint rim on dark pixels of the far edge so
 * a shadow creature still reads against a dark scene. Call before the outline.
 */
export function moonlight(s: SpriteCanvas, deep = false): void {
  const { w, d, box } = s;
  if (box.x1 < box.x0) return;
  changed.length = 0;
  tones.length = 0;
  const last = w - 1;
  const bottom = s.h - 1;
  for (let y = box.y0; y <= box.y1; y++)
    for (let x = box.x0, i = y * w + box.x0; x <= box.x1; x++, i++) {
      const c = d[i];
      if (!c) continue;
      let to = 0;
      if (x === 0 || y === 0 || !d[i - 1] || !d[i - w]) to = mix(c, MOON_RIM, STRENGTH.rim);
      else if (deep && (x === 1 || y === 1 || !d[i - 2] || !d[i - w - w] || !d[i - w - 1]))
        to = mix(c, MOON_RIM, STRENGTH.inner);
      else if ((x === last || y === bottom || !d[i + 1] || !d[i + w]) && cr(c) + cg(c) + cb(c) < DARK_BELOW)
        to = mix(c, BACK_RIM, STRENGTH.back);
      if (!to) continue;
      changed.push(i);
      tones.push(to);
    }
  for (let i = 0; i < changed.length; i++) d[changed[i]] = tones[i];
}
