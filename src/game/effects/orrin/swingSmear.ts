import { SWING_SMEAR as S } from "../../../constants/orrin/chainLook";
import { PAL } from "../../../constants/palette";
import { RES } from "../../../constants/stage";
import { fleck } from "../../../engine/frame";
import { grain } from "../../../utils/grain";

/** where on a turn round a pivot something is: the pivot, the radii of the path and the angle from straight below */
export interface OrbitPlace {
  x: number;
  y: number;
  rx: number;
  ry: number;
  angle: number;
}

/**
 * The smear a body leaves along the arc it swings on: thin streaks in lanes across the body's height, running back
 * along the path from where it is now, white hot brass at the body and cooling to rift blue as they trail off, each
 * lane a different length. `dir` is the way the angle is growing, and `strength` from 0 to 1 scales its length.
 */
export function drawSwingSmear(o: OrbitPlace, dir: number, strength: number): void {
  if (strength <= 0.02) return;
  const B = PAL.brass;
  const V = PAL.volt;
  const r = Math.max(o.rx, o.ry);
  const beat = Math.floor(o.angle * 9);
  for (let lane = 0; lane < S.lanes; lane++) {
    const off = (lane - (S.lanes - 1) / 2) * S.gap;
    const long = S.trail * strength * (0.45 + 0.55 * grain(lane, beat));
    const n = Math.ceil(long * r * RES);
    for (let k = 2 * RES; k < n; k++) {
      const u = k / n;
      const g = o.angle - dir * u * long;
      const c = u < 0.12 ? B[5] : u < 0.4 ? B[4] : u < 0.7 ? B[3] : V[3];
      fleck(o.x + Math.sin(g) * (o.rx + off), o.y + Math.cos(g) * (o.ry + off), c, (1 - u) * 1.2);
      if (u < S.thick)
        fleck(o.x + Math.sin(g) * (o.rx + off + 0.5), o.y + Math.cos(g) * (o.ry + off + 0.5), c, 1 - u / S.thick);
    }
  }
}
