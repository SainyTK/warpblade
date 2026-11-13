import { PAL } from "../../../constants/palette";
import { fleck, glow, line, px } from "../../../engine/frame";

/** the wingtip's height over the body at each flap frame, up to down */
const WING = [-3, -2, 0, 2, 1] as const;

/**
 * A carrion raven at (x, y) flying toward `face`: a blood-black body, head and fanned tail, a pale beak, a crimson eye,
 * and both wings beating through their frames as `flap` runs on, a dark crimson sheen on the near one. The caller has
 * placed the frame.
 */
export function drawRaven(x: number, y: number, face: number, flap: number, a = 1): void {
  if (a <= 0) return;
  const tip = WING[Math.floor(flap) % WING.length];
  const bx = Math.round(x);
  const by = Math.round(y);
  for (let i = -1; i <= 1; i++) px(bx + i * face, by, PAL.rage[0], a);
  px(bx + 2 * face, by - 1, PAL.rage[0], a);
  px(bx - 2 * face, by + 1, PAL.rage[0], a);
  px(bx - 3 * face, by + 1, PAL.rage[1], a);
  line(bx, by, bx - 2 * face, by + tip, PAL.rage[0], a);
  line(bx, by, bx + 2 * face, by + tip - 1, PAL.rage[1], a);
  fleck(bx + 3.2 * face + 0.5, by - 0.5, PAL.rage[5], a);
  fleck(bx + 2.4 * face + 0.5, by - 0.6, PAL.rage[4], a);
  glow(x, y, 5, PAL.rage[2], 0.2 * a);
}
