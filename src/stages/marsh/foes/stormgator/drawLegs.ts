import { RAIN_FOES as R } from "../../../../game/enemies/rain/colors";
import { GATOR_COLORS as C } from "./colors";
import { at } from "./frame";
import type { GatorPose } from "./pose";
import { type GatorCanvas } from "./scaled";

const HIPS = [-8, 6] as const;

function leg(s: GatorCanvas, p: GatorPose, hipX: number, phase: number, color: number): void {
  const swing = p.step * phase;
  const [hx, hy] = at(p, hipX, -5);
  const fx = hipX + p.lean * 0.5 + swing * 2.6 + 1.5;
  const fy = -0.6 - Math.max(0, swing) * 1.4;
  s.taper(hx, hy, fx, fy, 2.5, 1.5, color, 0.9);
  s.stroke(fx, fy, fx + 2.4, fy + 0.4, 0.5, color);
  s.stroke(fx, fy, fx + 1.6, fy + 0.8, 0.5, color);
  s.stroke(fx, fy, fx - 1.2, fy + 0.7, 0.5, color);
}

export function drawFarLegs(s: GatorCanvas, p: GatorPose): void {
  s.begin();
  HIPS.forEach((x, i) => leg(s, p, x + 2, i ? 1 : -1, C.hideDark));
  s.shadeEdges(C.hideDark, C.hide, C.hideDeep);
  s.commit();
}

export function drawNearLegs(s: GatorCanvas, p: GatorPose, hide: number): void {
  s.begin();
  HIPS.forEach((x, i) => leg(s, p, x, i ? -1 : 1, hide));
  s.shadeEdges(hide, C.hideLight, C.hideDark);
  s.commit();
  s.begin();
  HIPS.forEach((x, i) => {
    const fx = x + p.lean * 0.5 + p.step * (i ? -1 : 1) * 2.6 + 1.5;
    s.dot(fx, -0.9, 1.5, R.mud);
    s.dot(fx - 0.8, -2, 0.9, R.mud);
  });
  s.shadeEdges(R.mud, R.mudLight, R.mudDark);
  s.commit();
}
