import { ENEMY_COLORS as EC } from "../../constants/palette";
import { detailCanvas, type SpriteCanvas } from "../../engine/sprite";
import type { Enemy } from "../../types/enemy";
import { WHITE } from "../../utils/color";
import { litOrb } from "./litOrb";
import { taper } from "./taper";

const canvas = detailCanvas(36, 36, 18, 18);

/** an eye in image pixels: "h" its hot centre, "c" the eye, "g" the glow on its lower side */
const EYE = ["hc", "cc", ".g"];

/** the mouth in image pixels, a small crooked slit */
const MOUTH = ["mm.", "..m"];

/**
 * A floating shadow: a round body lit from the top left with a rim of light and a glint,
 * three trailing tendrils with a pale strand of vapour down each, and two glowing eyes that flare white before a lunge.
 */
export function drawWisp(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const sway = Math.sin(time * 5) * 1.5;
  s.clear();
  s.begin();
  const tendrils = [0, 1, 2].map((k) => {
    const ox = (k - 1) * 2.5;
    const wave = Math.sin(time * 6 + k * 2);
    return { x0: ox, y0: 2, x1: ox - 3 + wave * 2, y1: 8 + k * 1.5, r: 1.9 - k * 0.3, bend: wave * 1.2 };
  });
  for (const v of tendrils) taper(s, v.x0, v.y0, v.x1, v.y1, v.r, 0.7, EC.bodyDark, v.bend);
  s.shadeEdges(EC.bodyDark, EC.body, EC.bodyDeep);
  // a paler strand of vapour down each tendril
  for (const v of tendrils) taper(s, v.x0 - 0.4, v.y0 + 1, v.x1 - 0.2, v.y1 - 1, 0.35, 0.2, EC.bodyLight, v.bend);
  s.commit(false);
  s.begin();
  litOrb(s, 0, 0, 5.3, {
    deep: EC.bodyDeep,
    dark: EC.bodyDark,
    base: EC.body,
    light: EC.bodyLight,
    rim: EC.rim,
    glint: EC.bodyGlint,
  });
  s.commit();
  s.begin();
  const flare = e.state === "wind";
  const map = { h: flare ? WHITE : EC.eyeCore, c: flare ? EC.eyeCore : EC.eye, g: EC.eyeGlow };
  s.pixels(EYE, map, 1 + sway * 0.2 - 0.5, -2);
  s.pixels(EYE, map, 3 + sway * 0.2 - 0.5, -2);
  s.pixels(MOUTH, { m: EC.bodyDeep }, 1.5, 1.5);
  s.commit(false);
  s.outline(EC.outline);
  return s;
}
