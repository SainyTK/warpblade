import { ellipseRing, glow, place } from "../../engine/frame";
import type { Session } from "../../types/drill";

const VIOLET = 0xad7efc;

export function drawEnhancedGuard({ fighter: h, profile }: Session): void {
  if (h.guardAge === null || h.enhancedGuard <= 0) {
    return;
  }
  const x = h.x + h.face * 10;
  const y = h.y - 16;
  const alpha = h.enhancedGuard / profile.enhancedParry;
  place();
  glow(x, y, 16, VIOLET, 0.55 * alpha);
  ellipseRing(x, y, 6, 14, VIOLET, alpha * 0.7);
}
