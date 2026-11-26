import { heldAxis } from "../../rig";
import type { Vec } from "../../types/rig";
import { lerp } from "../../utils/math";

export function infusionBladePoint(hand: Vec, angle: number, reach: number, progress: number): Vec {
  return heldAxis(hand, angle)(lerp(3.4, reach - 0.7, progress), -0.8);
}
