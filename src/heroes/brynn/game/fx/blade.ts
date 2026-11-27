import { fleck, hairline, polygon } from "../../../../engine/frame";
import type { ElementKit } from "../../../../types/skillFx";
import { BRYNN_COLORS } from "../../look/colors";

const C = BRYNN_COLORS;

export function drawGreatsword(
  kit: ElementKit,
  x: number,
  y: number,
  angle: number,
  length: number,
  alpha: number,
): void {
  const R = kit.look.ramp;
  const ax = Math.cos(angle);
  const ay = Math.sin(angle);
  const nx = -ay;
  const ny = ax;
  const half = Math.max(1.5, length * 0.1);
  const at = (along: number, side: number): [number, number] => [
    x + ax * along + nx * side,
    y + ay * along + ny * side,
  ];
  const tip = at(length, 0);
  const shoulderL = at(length - half * 2.2, half);
  const shoulderR = at(length - half * 2.2, -half);
  const baseL = at(0, half);
  const baseR = at(0, -half);
  polygon([baseL, shoulderL, tip, shoulderR, baseR], R[1], alpha);
  polygon([at(0, half * 0.7), at(length - half * 2.4, half * 0.7), at(length - 1, 0), at(0, 0)], C.steelLight, alpha);
  polygon([at(0, 0), at(length - 1, 0), at(length - half * 2.4, -half * 0.7), at(0, -half * 0.7)], C.steel, alpha);
  hairline(baseL[0], baseL[1], shoulderL[0], shoulderL[1], R[4], alpha);
  hairline(shoulderL[0], shoulderL[1], tip[0], tip[1], R[5], alpha);
  hairline(baseR[0], baseR[1], shoulderR[0], shoulderR[1], R[3], alpha);
  hairline(shoulderR[0], shoulderR[1], tip[0], tip[1], R[4], alpha);
  const [gx0, gy0] = at(0, half * 2.1);
  const [gx1, gy1] = at(0, -half * 2.1);
  hairline(gx0, gy0, gx1, gy1, C.trim, alpha);
  const [hx, hy] = at(-length * 0.22, 0);
  hairline(x, y, hx, hy, C.glove, alpha);
  fleck(hx, hy, C.trimLight, alpha);
  const [jx, jy] = at(half * 0.8, 0);
  fleck(jx, jy, C.scarfLight, alpha);
}
