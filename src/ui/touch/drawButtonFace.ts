import { PAL } from "../../constants/palette";
import type { Color } from "../../types/color";
import type { SpriteImage } from "../../types/sprite";
import type { ButtonLook } from "../../types/touch";
import { hex, mix, scale } from "../../utils/color";
import type { PixelCanvas } from "./pixelCanvas";

const INK = hex("#0a0612");
const FILL = hex("#15122a");
const GLOW = hex("#e8e6f6");
const RIM = 2.2;
/** the ultimate's rim is the charge ring, so it is thicker and its face stays dark while held */
const ULT_RIM = 3.2;
/** the ultimate ring's four quarters are split by gaps this wide, as parts of a turn */
const QUARTER_GAP = 0.025;

/** how a rim pixel of the ultimate looks: quarters fill as the charge climbs, quarters the MP bar pays for glow faintly */
function ultimateRim(look: ButtonLook, angle: number): [Color, number] {
  const quarter = Math.floor(angle * 4);
  const within = angle * 4 - quarter;
  if (within < QUARTER_GAP * 4 || within > 1 - QUARTER_GAP * 4) return [INK, 0.9];
  if (look.charge > quarter + within) return [mix(look.accent, GLOW, 0.6), 1];
  if (quarter < look.affordable) return [scale(look.accent, look.charge >= 0 ? 0.4 : 0.7), 0.9];
  return [mix(look.accent, INK, 0.8), 0.8];
}

/**
 * One round pixel button: dark ring, colored rim, see-through face with a bevel and the icon.
 * Pressed buttons light up and their bevel and icon sink one pixel; a cooldown darkens a wedge that shrinks clockwise.
 */
export function drawButtonFace(canvas: PixelCanvas, look: ButtonLook, icon: SpriteImage, ultimate: boolean): void {
  const R = canvas.size / 2;
  const rim = look.ready ? look.accent : mix(look.accent, INK, 0.55);
  const rimWidth = ultimate ? ULT_RIM : RIM;
  const glow = look.pressed && !ultimate;
  const face = look.pressed ? mix(look.accent, FILL, glow ? 0.55 : 0.82) : FILL;
  const faceAlpha = look.pressed ? 0.78 : 0.5;
  canvas.clear();
  canvas.each((x, y, r, angle) => {
    if (r > R) return;
    if (r > R - 1) return canvas.put(x, y, INK, 0.9);
    if (r > R - rimWidth) {
      const cost = costRim(look, angle);
      if (cost) return canvas.put(x, y, cost, 1);
      const [c, a] = ultimate ? ultimateRim(look, angle) : [rim, 0.95];
      return canvas.put(x, y, c, a);
    }
    const lit = look.pressed ? angle > 0.125 && angle < 0.625 : angle > 0.625 || angle < 0.125;
    const bevel = r > R - rimWidth - 1.2 && lit;
    const shade = look.cooldown > 0 && angle < look.cooldown;
    if (shade) return canvas.put(x, y, INK, 0.82);
    canvas.put(x, y, bevel ? mix(face, GLOW, 0.22) : face, bevel ? faceAlpha + 0.12 : faceAlpha);
  });
  const dim = !look.ready || look.cooldown > 0;
  canvas.sprite(icon, look.pressed ? 1 : 0, (c) => (dim ? mix(scale(c, 0.55), INK, 0.25) : c));
  canvas.flush();
}

/** each step of an HP cost is this share of a turn of the rim, centred on the bottom */
const COST_STEP = 0.045;

/** an HP cost: the rim at the bottom of the button turns crimson over a length that grows with the cost, dimmed while
 *  it cannot be paid */
function costRim(look: ButtonLook, angle: number): Color | null {
  if (look.costPips <= 0) return null;
  const half = (look.costPips * COST_STEP) / 2;
  if (Math.abs(angle - 0.5) > half) return null;
  return look.ready ? PAL.rage[3] : PAL.rage[1];
}
