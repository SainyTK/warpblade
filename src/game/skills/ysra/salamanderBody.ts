import { EMBER } from "../../../constants/characters/ysra/look";
import { glow, place, px } from "../../../engine/frame";
import { WHITE } from "../../../utils/color";

/**
 * A fire salamander on the floor at (x, y) facing `face`: a low ember body with a darker back, four legs trading as it
 * runs (`stride` is the gait's phase), a tail that swishes, and bright eyes; `size` 2 draws the Magma Drake.
 */
export function drawSalamander(x: number, y: number, face: number, stride: number, size: number, open: number): void {
  place();
  const s = size;
  const at = (dx: number, dy: number, c: number) => {
    for (let i = 0; i < s; i++) for (let j = 0; j < s; j++) px(x + face * dx * s + face * i, y + dy * s + j, c);
  };
  const swing = Math.sin(stride * Math.PI * 2);
  // tail, thinning and swishing
  for (let i = 0; i < 4; i++) at(-4 - i, -2 + Math.round(swing * (i / 3)), EMBER[i < 2 ? 3 : 2]);
  // body: belly bright, back dark
  for (let i = -3; i <= 2; i++) {
    at(i, -2, EMBER[4]);
    at(i, -3, EMBER[2]);
  }
  // head, with the jaw open while it bites
  at(3, -3, EMBER[3]);
  at(4, -3, EMBER[3]);
  at(4, -2 + open, EMBER[4]);
  at(3, -4, EMBER[2]);
  at(4, -4, WHITE);
  // legs trading
  const lift = swing > 0 ? 1 : 0;
  at(-2, -1, EMBER[2]);
  at(1, -1, EMBER[2]);
  at(-2 + lift, 0, EMBER[1]);
  at(1 - lift, 0, EMBER[1]);
  glow(x, y - 2 * s, 8 * s, EMBER[4], 0.3);
}
