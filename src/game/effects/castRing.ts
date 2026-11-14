import { ellipseRing, fleck, glow, place } from "../../engine/frame";
import type { Color } from "../../types/color";
import { scale, WHITE } from "../../utils/color";
import { clamp, TAU } from "../../utils/math";
import { game, hero } from "../state";
import { fineRing } from "./fine";

/**
 * A rune ring turning at the casting hand while a spell gathers, in the spell's colour; `share` is how far the cast
 * has come toward leaving the hand, 0 to 1. A kit calls it from its `draw` while its hero casts.
 */
export function drawCastRing(color: Color, share: number): void {
  place(hero.x, hero.y, hero.face < 0);
  const k = clamp(share);
  const [cx, cy] = [hero.hand[0] + 2, hero.hand[1]];
  const r = 3 + k * 4;
  ellipseRing(cx, cy, r, r * 1.1, color, 0.8);
  fineRing(cx, cy, r - 1.5, (r - 1.5) * 1.1, WHITE, k * 0.7);
  fineRing(cx, cy, r + 1.5, (r + 1.5) * 1.1, scale(color, 0.6), 0.5);
  // rune marks turning the other way around the ring: a white point with a short tail in the spell's color
  for (let i = 0; i < 6; i++) {
    const g = game.t * 6 + (i * TAU) / 6;
    const d = 7 + k * 2;
    fleck(cx + Math.cos(g) * d, cy + Math.sin(g) * d, WHITE, k * 1.5);
    fleck(cx + Math.cos(g - 0.12) * d, cy + Math.sin(g - 0.12) * d, color, k);
    fleck(cx + Math.cos(g - 0.24) * d, cy + Math.sin(g - 0.24) * d, color, k * 0.6);
  }
  glow(cx, cy, 18, color, 0.45 * k);
}
