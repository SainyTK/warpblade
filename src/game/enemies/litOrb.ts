import type { SpriteCanvas } from "../../engine/sprite";

/** the specular glint in image pixels, on a small orb and on a large one */
const GLINT = { small: ["gg", "g."], large: [".ggg", "gggg", "gg..", "g..."] };

/** the tones of a round volume, deepest shadow to specular glint */
export interface OrbTones {
  deep: number;
  dark: number;
  base: number;
  light: number;
  rim: number;
  glint: number;
}

/**
 * A round volume lit from the top left, into the current layer: a shadow crescent on the lower right with a deep edge,
 * a soft light toward the top left, a thin rim of light along the upper edge and a specular glint.
 */
export function litOrb(s: SpriteCanvas, cx: number, cy: number, r: number, t: OrbTones): void {
  s.dot(cx, cy, r, t.dark);
  s.dot(cx - r * 0.1, cy - r * 0.12, r * 0.88, t.base);
  s.dot(cx - r * 0.28, cy - r * 0.3, r * 0.55, t.light);
  s.shadeEdges(t.dark, t.dark, t.deep, 2);
  const step = 0.4 / (r * s.res);
  for (let a = -2.75; a < -0.55; a += step) s.set(cx + Math.cos(a) * (r - 0.3), cy + Math.sin(a) * (r - 0.3), t.rim);
  s.pixels(r < 8 ? GLINT.small : GLINT.large, { g: t.glint }, cx - r * 0.58, cy - r * 0.6);
}
