import { ellipseRing, glow, place } from "../../engine/frame";
import { CHAIN } from "../constants";
import type { Fighter } from "../simulation";

const VIOLET = 0xad7efc;

export function drawEnhancedGuard(h: Fighter): void {
  if (h.guardAge === null || h.enhancedGuard <= 0) {
    return;
  }
  const x = h.x + h.face * 10;
  const y = h.y - 16;
  const alpha = h.enhancedGuard / CHAIN.enhancedWindow;
  place();
  glow(x, y, 16, VIOLET, 0.55 * alpha);
  ellipseRing(x, y, 6, 14, VIOLET, alpha * 0.7);
}
