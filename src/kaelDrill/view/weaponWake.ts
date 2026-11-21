import { hairline, place } from "../../engine/frame";
import type { Ramp } from "../../types/color";
import type { Vec } from "../../types/rig";

export function drawWeaponWake(trail: readonly Vec[], angle: number, ramp: Ramp): void {
  place();
  const c = Math.cos(angle);
  const n = Math.sin(angle);
  for (let i = 1; i < trail.length; i++) {
    const [ax, ay] = trail[i - 1];
    const [bx, by] = trail[i];
    const young = i / trail.length;
    const spread = (1 - young) * 2;
    hairline(ax - n * spread, ay + c * spread, bx - n * spread, by + c * spread, ramp[2], young * 0.7);
    hairline(ax + n * spread, ay - c * spread, bx + n * spread, by - c * spread, ramp[2], young * 0.7);
    hairline(ax, ay, bx, by, ramp[i > 5 ? 5 : 3], young);
  }
}
