import { SPELL_HEIGHT } from "../../../drill/constants";
import { place } from "../../../engine/frame";
import type { ElementProjectile } from "../../../types/drill";
import { clamp } from "../../../utils/math";
import { drawTide } from "./drawTide";
import { TIDE } from "./tide";

export function drawTideBolt(bolt: ElementProjectile): void {
  const grow = clamp(bolt.distance / (TIDE.bolt.grow * 150));
  place(bolt.x, bolt.y + SPELL_HEIGHT, bolt.face < 0);
  drawTide(TIDE.bolt.height * (0.45 + 0.55 * grow), bolt.distance, 1);
  place();
}
