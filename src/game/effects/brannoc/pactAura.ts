import { PAL } from "../../../constants/palette";
import { fleck, glow, px } from "../../../engine/frame";

/** where the drips run from, px off his middle, and how far they fall before they are gone */
const DRIPS = [-6, 5, -2, 7] as const;
const FALL = 18;
/** his chest and his arms, in px above his feet */
const CHEST = 18;
const ARMS = 20;

/**
 * Blood Pact on him: a faint crimson aura pulsing round his chest and drops of blood running off his arms, fading as
 * `k` runs to 0. `t` is the game time. The caller has placed the frame.
 */
export function drawPactAura(x: number, floor: number, t: number, k: number): void {
  if (k <= 0) return;
  const pulse = 0.75 + 0.25 * Math.sin(t * 6);
  glow(x, floor - CHEST, 18, PAL.rage[3], 0.16 * pulse * k);
  glow(x, floor - CHEST, 8, PAL.rage[4], 0.1 * pulse * k);
  for (let i = 0; i < DRIPS.length; i++) {
    const u = (t * 1.3 + i / DRIPS.length) % 1;
    const dx = x + DRIPS[i];
    const dy = floor - ARMS + u * FALL;
    px(dx - 0.5, dy - 0.5, PAL.rage[3], k * (1 - u) * 0.8);
    fleck(dx, dy - 1.5, PAL.rage[2], k * (1 - u) * 0.5);
  }
}
