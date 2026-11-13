import { PAL } from "../../../constants/palette";
import { fleck, glow, px } from "../../../engine/frame";

/**
 * Haemorrhage's mark over a foe, its tip at (x, y): a small crimson drop with a pale glint, pulsing faster and brighter
 * as `fuse` (the share of its fuse gone) runs to 1. `t` is the game time. The caller has placed the frame.
 */
export function drawBloodDrop(x: number, y: number, fuse: number, t: number): void {
  const beat = 0.5 + 0.5 * Math.sin(t * (6 + fuse * 18));
  const a = 0.75 + 0.25 * beat;
  px(x - 0.5, y - 0.5, PAL.rage[3], a);
  px(x - 1.5, y + 0.5, PAL.rage[2], a);
  px(x - 0.5, y + 0.5, PAL.rage[3], a);
  px(x + 0.5, y + 0.5, PAL.rage[3], a);
  px(x - 1.5, y + 1.5, PAL.rage[2], a);
  px(x - 0.5, y + 1.5, PAL.rage[3], a);
  px(x + 0.5, y + 1.5, PAL.rage[2], a);
  px(x - 0.5, y + 2.5, PAL.rage[1], a);
  fleck(x - 0.6, y + 0.6, PAL.rage[5], a);
  glow(x, y + 1, 5 + fuse * 3, PAL.rage[3], (0.2 + 0.25 * fuse) * beat);
}
