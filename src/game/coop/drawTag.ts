import { SEAT_COLORS, SEAT_SHADES } from "../../constants/coop";
import { drawText } from "../../engine/font";
import { place, px } from "../../engine/frame";
import { hex } from "../../utils/color";
import { hero } from "../state";

/** how far over the hero's feet the tag floats */
const LIFT = 50;

/** the player's place over the hero being drawn: P1 to P4 in their colour, with a small pointer, dimmed while down */
export function drawTag(slot: number, down: boolean): void {
  const c = hex(SEAT_COLORS[slot]);
  const shade = hex(SEAT_SHADES[slot]);
  const a = down ? 0.45 : 1;
  const x = Math.round(hero.x);
  const y = Math.round(hero.y - (down ? 20 : LIFT));
  place();
  drawText(`P${slot + 1}`, x, y, c, shade, 1, a);
  for (let i = -1; i <= 1; i++) px(x + i, y + 7, c, a);
  px(x, y + 8, c, a);
}
