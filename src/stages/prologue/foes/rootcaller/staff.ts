import type { SpriteCanvas } from "../../../../engine/sprite";
import { mix, WHITE } from "../../../../utils/color";
import { ROOTCALLER_COLORS as C } from "./colors";
import type { RootcallerPose } from "./pose";

const KNOTS = [0.25, 0.55, 0.8] as const;

export function drawStaff(s: SpriteCanvas, p: RootcallerPose, time: number): void {
  const [fx, fy] = p.foot;
  const [tx, ty] = p.tip;
  const len = Math.hypot(tx - fx, ty - fy) || 1;
  const ux = (tx - fx) / len;
  const uy = (ty - fy) / len;
  s.begin();
  s.taper(fx, fy, tx, ty, 0.6, 0.85, C.bark[2], 0.6);
  for (const k of KNOTS) s.dot(fx + (tx - fx) * k, fy + (ty - fy) * k, 0.95, C.bark[2]);
  s.taper(tx, ty, tx - uy * 2.6 + ux * 2.5, ty + ux * 2.6 + uy * 2.5, 0.6, 0.3, C.bark[2]);
  s.taper(tx, ty, tx + uy * 2.6 + ux * 2.5, ty - ux * 2.6 + uy * 2.5, 0.6, 0.3, C.bark[2]);
  s.shadeEdges(C.bark[2], C.bark[3], C.bark[0]);
  s.commit();
  const cx = tx + ux * 2.2 + p.quiver;
  const cy = ty + uy * 2.2;
  const pulse = 0.5 + 0.5 * Math.sin(time * 6);
  const core = p.heat > 0.7 ? C.seed[3] : mix(C.seed[1], C.seed[2], Math.max(p.heat, pulse * 0.4));
  s.begin();
  s.dot(cx, cy, 1.9 + p.heat * 0.4, core);
  s.shadeEdges(core, C.seed[3], C.seed[0]);
  s.set(cx - 0.5, cy - 0.5, p.heat > 0.85 ? WHITE : C.seed[3]);
  s.commit();
  s.begin();
  s.taper(tx, ty, cx + uy * 1.6, cy - ux * 1.6, 0.4, 0.25, C.seedHusk, -0.6);
  s.shadeEdges(C.seedHusk, C.bark[3], C.bark[0]);
  s.commit();
  s.begin();
  s.dot(p.hand[0], p.hand[1], 1.2, C.bark[3]);
  s.shadeEdges(C.bark[3], C.barkGlint, C.bark[1]);
  s.commit();
}
