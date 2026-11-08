import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Vec } from "./reach";

/**
 * The chain where it leaves the fist: a wrap of two links over the knuckles, laid along the weapon angle. The rest of
 * the chain is drawn in the world, from the hand to the hook, so it can reach far past the sprite.
 */
export function drawChainGrip(s: SpriteCanvas, hand: Vec, angle: number): void {
  const ca = Math.cos(angle);
  const sn = Math.sin(angle);
  s.begin();
  s.stroke(hand[0] - ca * 0.6, hand[1] - sn * 0.6, hand[0] + ca * 1.6, hand[1] + sn * 1.6, 0.6, HC.steel);
  s.shadeEdges(HC.steel, HC.steelLight, HC.steelDeep);
  s.commit();
  s.begin();
  s.set(hand[0] + ca * 1.2 - sn * 0.5, hand[1] + sn * 1.2 + ca * 0.5 - 0.5, HC.steelGlint);
  s.commit(false);
}
