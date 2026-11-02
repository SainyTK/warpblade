import type { Color } from "../../types/color";
import type { SpriteImage } from "../../types/sprite";
import type { ButtonLook } from "../../types/touch";
import { hex, mix, scale } from "../../utils/color";
import type { PixelCanvas } from "./pixelCanvas";

const INK = hex("#0a0612");
const FILL = hex("#15122a");
const GLOW = hex("#e8e6f6");
const RIM = 2.2;
/** the ultimate ring's four quarters are split by gaps this wide, as parts of a turn */
const QUARTER_GAP = 0.025;

/** how a rim pixel of the ultimate looks: quarters fill as the charge climbs, quarters the MP bar pays for glow faintly */
function ultimateRim(look: ButtonLook, angle: number): [Color, number] {
  const quarter = Math.floor(angle * 4);
  const within = angle * 4 - quarter;
  if (within < QUARTER_GAP * 4 || within > 1 - QUARTER_GAP * 4) return [INK, 0.9];
  if (look.charge > quarter + within) return [mix(look.accent, GLOW, 0.35), 1];
  if (quarter < look.affordable) return [scale(look.accent, 0.6), 0.9];
  return [mix(look.accent, INK, 0.8), 0.8];
}

/**
 * One round pixel button: dark ring, colored rim, see-through face with a bevel and the icon.
 * Pressed buttons light up and their bevel and icon sink one pixel; a cooldown darkens a wedge that shrinks clockwise.
 */
export function drawButtonFace(canvas: PixelCanvas, look: ButtonLook, icon: SpriteImage, ultimate: boolean): void {
  const R = canvas.size / 2;
  const rim = look.ready ? look.accent : mix(look.accent, INK, 0.55);
  const face = look.pressed ? mix(look.accent, FILL, 0.55) : FILL;
  const faceAlpha = look.pressed ? 0.78 : 0.5;
  canvas.clear();
  canvas.each((x, y, r, angle) => {
    if (r > R) return;
    if (r > R - 1) return canvas.put(x, y, INK, 0.9);
    if (r > R - RIM) {
      const [c, a] = ultimate ? ultimateRim(look, angle) : [rim, 0.95];
      return canvas.put(x, y, c, a);
    }
    const lit = look.pressed ? angle > 0.125 && angle < 0.625 : angle > 0.625 || angle < 0.125;
    const bevel = r > R - RIM - 1.2 && lit;
    const shade = look.cooldown > 0 && angle < look.cooldown;
    if (shade) return canvas.put(x, y, INK, 0.82);
    canvas.put(x, y, bevel ? mix(face, GLOW, 0.22) : face, bevel ? faceAlpha + 0.12 : faceAlpha);
  });
  const dim = !look.ready || look.cooldown > 0;
  canvas.sprite(icon, look.pressed ? 1 : 0, (c) => (dim ? mix(scale(c, 0.55), INK, 0.25) : c));
  canvas.flush();
}
