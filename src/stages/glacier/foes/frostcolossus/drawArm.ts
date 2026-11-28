import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Pt } from "../shapes";
import { COLOSSUS_COLORS } from "./colors";
import { plate } from "./plate";
import type { ColossusPose } from "./pose";

const St = COLOSSUS_COLORS.stone;
const Ic = COLOSSUS_COLORS.ice;

export function drawArm(s: SpriteCanvas, p: ColossusPose, near: boolean): void {
  const y = p.lift + p.hunch;
  const shoulder: Pt = near ? [5, -41 + y] : [-9, -44 + y];
  const fist = near ? p.nearFist : p.farFist;
  const elbow: Pt = [(shoulder[0] + fist[0]) / 2 + (near ? -2 : -3), (shoulder[1] + fist[1]) / 2 + 2];
  const tone = near ? St[3] : St[2];
  s.begin();
  s.stroke(shoulder[0], shoulder[1], elbow[0], elbow[1], near ? 3.6 : 3.2, tone);
  s.taper(elbow[0], elbow[1], fist[0], fist[1] - 3, near ? 4 : 3.6, near ? 5.2 : 4.6, tone);
  s.shadeEdges(tone, near ? St[4] : St[3], St[1], 2);
  s.commit();
  const ux = fist[0] - elbow[0];
  const uy = fist[1] - elbow[1];
  const len = Math.hypot(ux, uy) || 1;
  const nx = (-uy / len) * 4.5;
  const ny = (ux / len) * 4.5;
  const gx = elbow[0] + ux * 0.35;
  const gy = elbow[1] + uy * 0.35;
  const hx = elbow[0] + ux * 0.75;
  const hy = elbow[1] + uy * 0.75;
  const tones = near
    ? { dark: Ic[1], base: Ic[2], lit: Ic[3], rim: Ic[4] }
    : { dark: Ic[0], base: Ic[1], lit: Ic[2], rim: Ic[3] };
  plate(
    s,
    [
      [gx - nx, gy - ny],
      [gx + nx, gy + ny],
      [hx + nx, hy + ny],
      [hx - nx, hy - ny],
    ],
    [
      [gx - nx, gy - ny],
      [hx - nx, hy - ny],
    ],
    tones,
  );
  const [fx, fy] = fist;
  plate(
    s,
    [
      [fx - 6, fy - 6],
      [fx + 5, fy - 7],
      [fx + 8, fy - 1],
      [fx + 6, fy + 5],
      [fx - 5, fy + 5],
      [fx - 8, fy],
    ],
    [
      [fx - 5, fy - 5],
      [fx + 5, fy - 6],
    ],
    tones,
  );
  s.begin();
  for (let i = 0; i < 3; i++) s.hairline(fx - 3 + i * 3, fy - 4, fx - 3 + i * 3, fy + 3, near ? Ic[0] : St[0]);
  s.commit(false);
}
