import type { SpriteCanvas } from "../../../../engine/sprite";
import { LORD_COLORS as L } from "./colors";
import type { LordPose } from "./pose";

const S = L.steel;
const R = L.rune;

export function drawSword(s: SpriteCanvas, p: LordPose): void {
  const [gx, gy] = p.grip;
  const [tx, ty] = p.tip;
  const len = Math.hypot(tx - gx, ty - gy) || 1;
  const ux = (tx - gx) / len;
  const uy = (ty - gy) / len;
  const nx = -uy;
  const ny = ux;
  const guard = 2.5;
  s.begin();
  s.stroke(gx - ux * 4, gy - uy * 4, gx + ux * guard, gy + uy * guard, 0.7, L.leather[2]);
  s.dot(gx - ux * 4.5, gy - uy * 4.5, 1.1, L.brass[1]);
  s.stroke(
    gx + ux * guard + nx * 4,
    gy + uy * guard + ny * 4,
    gx + ux * guard - nx * 4,
    gy + uy * guard - ny * 4,
    0.7,
    L.brass[1],
  );
  s.shadeEdges(L.brass[1], L.brass[2], L.brass[0]);
  s.commit();
  const base = guard + 1;
  const w = 1.7;
  s.begin();
  s.poly(
    [
      [gx + ux * base + nx * w, gy + uy * base + ny * w],
      [tx - ux * 2 + nx * w, ty - uy * 2 + ny * w],
      [tx, ty],
      [tx - ux * 2 - nx * w, ty - uy * 2 - ny * w],
      [gx + ux * base - nx * w, gy + uy * base - ny * w],
    ],
    S[3],
  );
  s.shadeEdges(S[3], S[4], S[1]);
  const glyph = p.heat > 0.5 ? R[3] : p.open ? R[0] : R[2];
  s.hairline(gx + ux * base, gy + uy * base, tx - ux * 3, ty - uy * 3, S[1]);
  for (let d = base + 2; d < len * 0.6; d += 2.5) s.set(gx + ux * d, gy + uy * d, glyph);
  s.hairline(gx + ux * base + nx, gy + uy * base + ny, tx - ux * 2 + nx, ty - uy * 2 + ny, S[5]);
  s.set(tx, ty, p.heat > 0.5 ? S[5] : S[4]);
  s.commit();
}
