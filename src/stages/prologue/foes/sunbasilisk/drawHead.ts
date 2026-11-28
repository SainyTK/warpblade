import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import { BASILISK_COLORS as C } from "./colors";
import type { BasiliskPose } from "./pose";

type Pt = readonly [number, number];
const S = C.scale;

function turn(points: readonly Pt[], hx: number, hy: number, a: number): Pt[] {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return points.map(([x, y]) => [hx + (x - hx) * c - (y - hy) * s, hy + (x - hx) * s + (y - hy) * c]);
}

function jaw(s: SpriteCanvas, hx: number, hy: number, open: number): Pt[] {
  const hinge: Pt = [hx + 1, hy + 1];
  const lower = turn(
    [hinge, [hx + 16, hy + 1.2], [hx + 15, hy + 3.4], [hx + 7, hy + 5], [hx - 1, hy + 5]],
    hinge[0],
    hinge[1],
    open * 0.55,
  );
  if (open > 0.08) {
    s.begin();
    s.poly([hinge, [hx + 17, hy + 0.5], lower[1]], C.maw);
    s.hairline(hx + 4, hy + 1.5, lower[1][0] - 2, lower[1][1] - 1, C.gum);
    s.commit(false);
  }
  s.begin();
  s.poly(lower, C.belly[2]);
  s.shadeEdges(C.belly[2], C.belly[3], C.belly[0], 2);
  if (open > 0.08)
    for (let k = 0.3; k < 0.95; k += 0.14) {
      const x = hinge[0] + (lower[1][0] - hinge[0]) * k;
      const y = hinge[1] + (lower[1][1] - hinge[1]) * k;
      s.set(x, y - 0.5, C.tooth);
      s.set(x, y - 1, C.toothShade);
    }
  s.commit();
  return lower;
}

function skull(s: SpriteCanvas, hx: number, hy: number, open: number): void {
  s.begin();
  s.poly(
    [
      [hx - 4, hy - 7],
      [hx + 6, hy - 8.5],
      [hx + 13, hy - 6],
      [hx + 18, hy - 2],
      [hx + 18, hy + 1],
      [hx + 3, hy + 1.5],
      [hx - 4, hy + 3.5],
    ],
    S[2],
  );
  s.shadeEdges(S[2], S[4], S[0], 2);
  s.commit();
  s.begin();
  s.taper(hx + 2, hy - 7, hx - 7, hy - 10, 1.4, 0.3, C.spine[1], 0.8);
  s.taper(hx + 0, hy - 5, hx - 8, hy - 5.5, 1.1, 0.3, C.spine[1], 0.5);
  s.shadeEdges(C.spine[1], C.spine[2], C.spine[0]);
  s.commit();
  s.begin();
  s.stroke(hx + 4, hy - 6.4, hx + 11, hy - 5.6, 1.1, S[1]);
  s.shadeEdges(S[1], S[3], S[0]);
  s.hairline(hx + 4, hy - 7.4, hx + 10, hy - 6.8, S[5]);
  s.set(hx + 16, hy - 2, S[0]);
  s.set(hx + 15.5, hy - 2, S[0]);
  if (open > 0.08)
    for (let x = hx + 6; x < hx + 17; x += 2) {
      s.set(x, hy + 1.5, C.tooth);
      s.set(x, hy + 2, C.toothShade);
    }
  for (let x = hx; x < hx + 12; x += 2.5) s.set(x, hy - 3 + (x - hx) * 0.08, S[2]);
  s.commit();
}

function eye(s: SpriteCanvas, hx: number, hy: number, charge: number, time: number): void {
  const x = hx + 7.5;
  const y = hy - 3.5;
  const pulse = charge > 0 ? 0.3 * Math.sin(time * 30) : 0;
  s.begin();
  s.dot(x, y, 2.1, C.maw);
  s.dot(x + 0.3, y + 0.2, 1.3 + charge * 0.6 + pulse, charge > 0.5 ? C.sun[2] : C.sun[1]);
  s.block(x - 1.5, y - 1.6, S[0], 3.5, 0.6);
  s.set(x, y, WHITE);
  s.set(x - 0.5, y - 0.5, charge > 0.3 ? WHITE : C.sun[3]);
  s.commit(false);
}

export function drawHead(s: SpriteCanvas, hx: number, hy: number, p: BasiliskPose, time: number): void {
  jaw(s, hx, hy, p.jaw);
  skull(s, hx, hy, p.jaw);
  eye(s, hx, hy, p.charge, time);
}
