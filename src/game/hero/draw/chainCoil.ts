import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { lerp } from "../../../utils/math";
import type { Vec } from "./reach";

/**
 * Three turns of steel chain round the forearm, between the elbow and the wrap: each turn a dark band with a lit link
 * on its top edge, so the coil reads as links and not as a bracer.
 */
export function drawChainCoil(s: SpriteCanvas, elbow: Vec, hand: Vec): void {
  const dx = hand[0] - elbow[0];
  const dy = hand[1] - elbow[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  s.begin();
  for (const u of [0.22, 0.38, 0.54]) {
    const cx = lerp(elbow[0], hand[0], u);
    const cy = lerp(elbow[1], hand[1], u);
    s.stroke(cx - nx * 1.3, cy - ny * 1.3, cx + nx * 1.3 + dx / len, cy + ny * 1.3 + dy / len, 0.55, HC.steelDark);
  }
  s.shadeEdges(HC.steelDark, HC.steel, HC.steelDeep);
  s.commit();
  s.begin();
  for (const u of [0.22, 0.38, 0.54]) {
    const cx = lerp(elbow[0], hand[0], u);
    const cy = lerp(elbow[1], hand[1], u);
    s.set(cx - nx * 0.8, cy - ny * 0.8, HC.steelLight);
  }
  s.commit(false);
}
