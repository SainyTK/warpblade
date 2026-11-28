import type { SpriteCanvas } from "../../../../engine/sprite";
import { BASILISK_COLORS as C } from "./colors";
import type { SpinePoint } from "./spine";

const S = C.scale;
const HIPS = [9, 17] as const;

function leg(s: SpriteCanvas, q: SpinePoint, step: number, near: boolean): void {
  const base = near ? S[2] : S[1];
  const hx = q.x + (near ? 0 : 3);
  const hy = q.y + q.r * 0.4;
  const kx = hx + 3 + step;
  const ky = Math.min(-3, hy + 4);
  const fx = hx + 2 + step * 1.6;
  const lift = Math.max(0, -step) * 1.2;
  s.begin();
  s.taper(hx, hy, kx, ky, near ? 3 : 2.6, 2, base);
  s.taper(kx, ky, fx, -1 - lift, 2, 1.4, base);
  s.shadeEdges(base, near ? S[3] : S[2], near ? S[1] : S[0], 2);
  s.commit();
  s.begin();
  for (const [dx, len] of [
    [-1.5, 2],
    [0.3, 3],
    [1.8, 2.6],
  ] as const)
    s.taper(fx + dx, -1 - lift, fx + dx + len, 0.2 - lift, 0.6, 0.25, near ? C.claw : C.outline);
  if (near) s.shadeEdges(C.claw, C.clawLit, C.outline);
  s.commit();
}

export function drawFarLegs(s: SpriteCanvas, spine: readonly SpinePoint[], stride: number): void {
  leg(s, spine[HIPS[0]], stride * 2, false);
  leg(s, spine[HIPS[1]], -stride * 2, false);
}

export function drawNearLegs(s: SpriteCanvas, spine: readonly SpinePoint[], stride: number): void {
  leg(s, spine[HIPS[0]], -stride * 2, true);
  leg(s, spine[HIPS[1]], stride * 2, true);
}
