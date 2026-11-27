import type { SpriteCanvas } from "../../../../engine/sprite";
import { RAIN_FOES as R, STORM_VOLT } from "../../../../game/enemies/rain/colors";
import { WHITE } from "../../../../utils/color";
import { SEER as C } from "./colors";
import type { SeerPose } from "./pose";

export function drawStaff(s: SpriteCanvas, p: SeerPose, time: number): void {
  const [fx, fy] = p.foot;
  const [tx, ty] = p.tip;
  const len = Math.hypot(tx - fx, ty - fy) || 1;
  const ux = (tx - fx) / len;
  const uy = (ty - fy) / len;
  const headX = tx - ux * 3;
  const headY = ty - uy * 3;
  s.begin();
  s.stroke(fx, fy, tx - ux * 5, ty - uy * 5, 0.6, C.staff);
  s.shadeEdges(C.staff, C.staffLight, C.staffDark);
  s.commit();
  s.begin();
  s.stroke(tx - ux * 6, ty - uy * 6, tx - ux * 1, ty - uy * 1, 1.3, R.cattail);
  s.shadeEdges(R.cattail, R.cattailLight, R.mudDeep);
  s.hairline(tx - ux * 1, ty - uy * 1, tx + ux * 2.5, ty + uy * 2.5, C.staffLight);
  for (let i = 0; i < 3; i++) {
    const k = 1.5 + i * 1.6;
    const lit = p.charge > 0.3 || Math.sin(time * 3 + i * 1.3) > 0.4;
    s.set(tx - ux * k - 1, ty - uy * k, lit ? R.wartHot : R.wart);
  }
  s.commit();
  s.begin();
  const r = 0.8 + p.charge * 1.4;
  const ox = Math.sin(time * 4) * 0.3;
  s.dot(headX + ox, headY - 0.5, r, STORM_VOLT[3]);
  s.shadeEdges(STORM_VOLT[3], STORM_VOLT[4], STORM_VOLT[2]);
  s.block(headX + ox - 0.5, headY - 1, p.charge > 0.6 ? WHITE : STORM_VOLT[4], 1, 1);
  s.commit(false);
  if (p.charge <= 0) return;
  s.begin();
  for (let i = 0; i < 3; i++) {
    const a = time * 5 + (i * Math.PI * 2) / 3;
    const d = 4 + p.charge * 2;
    s.set(headX + Math.cos(a) * d, headY + Math.sin(a) * d * 0.7, R.water);
    if (Math.sin(time * 50 + i) > 0.3) {
      const cx = headX + Math.cos(a) * 2;
      const cy = headY + Math.sin(a) * 2;
      s.hairline(cx, cy, cx + Math.cos(a) * 2, cy + Math.sin(a) * 2 + 0.6, STORM_VOLT[4]);
    }
  }
  s.commit(false);
}
