import type { SpriteCanvas } from "../../../../engine/sprite";
import { LORD_COLORS as L } from "./colors";
import type { LordPose } from "./pose";

const S = L.steel;
const R = L.rune;

export function drawHelm(s: SpriteCanvas, p: LordPose): void {
  const hx = 1.5 + p.lean * 1.2;
  const hy = -36 + p.crouch + (p.limp ? 1 : 0);
  s.begin();
  s.block(hx - 3.6, hy + 3.4, S[1], 7.6, 2);
  s.shadeEdges(S[1], S[2], L.dark[0]);
  s.commit();
  s.begin();
  for (const [dx, h] of [
    [-3.4, 3],
    [-1.4, 5],
    [0.8, 6],
    [3, 4],
  ] as const)
    s.poly(
      [
        [hx + dx - 0.9, hy - 3.6],
        [hx + dx + 0.2, hy - 3.6 - h],
        [hx + dx + 1, hy - 3.6],
      ],
      S[2],
    );
  s.shadeEdges(S[2], S[4], S[1]);
  s.commit();
  s.begin();
  s.poly(
    [
      [hx - 4, hy - 1],
      [hx - 3, hy - 4],
      [hx + 1, hy - 4.8],
      [hx + 4.2, hy - 3.6],
      [hx + 5, hy - 0.4],
      [hx + 4.8, hy + 3.6],
      [hx - 4, hy + 3.6],
    ],
    S[3],
  );
  s.shadeEdges(S[3], S[4], S[1], 2);
  s.commit();
  s.begin();
  s.hairline(hx + 1, hy - 4.4, hx + 1, hy + 3.2, S[5]);
  s.hairline(hx - 3, hy - 3.4, hx, hy - 4.2, S[5]);
  const eye = p.open ? R[1] : p.heat > 0.5 ? R[4] : R[2];
  s.block(hx - 0.2, hy - 0.8, L.slit, 5, 1.4);
  s.set(hx + 1.6, hy - 0.4, eye);
  s.set(hx + 3.4, hy - 0.4, eye);
  if (p.heat > 0.5) s.set(hx + 2.5, hy - 0.4, R[3]);
  for (let k = 0; k < 3; k++) s.set(hx + 2 + k * 1, hy + 1.8, L.slit);
  s.hairline(hx - 3.6, hy + 3.2, hx + 4.6, hy + 3.2, S[1]);
  s.commit(false);
}
