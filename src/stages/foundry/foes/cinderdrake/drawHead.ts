import type { SpriteCanvas } from "../../../../engine/sprite";
import { DRAKE } from "./colors";
import type { DrakePose } from "./pose";

const H = DRAKE.hide;
const E = DRAKE.ember;
const N = DRAKE.horn;

function neck(s: SpriteCanvas, hx: number, hy: number, p: DrakePose): void {
  s.begin();
  s.taper(5, -3, hx - 0.5, hy + 0.5, 3.4, 2.2, H[2], -1.4);
  s.shadeEdges(H[2], H[3], H[1], 2);
  s.commit();
  s.begin();
  for (let u = 0.2; u < 0.95; u += 0.25) {
    const x = 5 + (hx - 5) * u;
    const y = -3 + (hy + 3) * u;
    s.hairline(x - 0.4, y + 2.2, x + 1, y + 1.4, p.heat > 0.5 ? E[3] : E[2]);
    s.set(x - 1.6, y - 2.4, N[2]);
  }
  s.commit(false);
}

export function drawHead(s: SpriteCanvas, p: DrakePose): void {
  const hx = 12;
  const hy = -9 + p.neck;
  const drop = p.jaw * 2.8;
  neck(s, hx, hy, p);
  if (p.jaw > 0.15) {
    s.begin();
    s.poly(
      [
        [hx, hy - 0.2],
        [hx + 8, hy - 0.4],
        [hx + 7, hy + 1 + drop],
        [hx, hy + 1.6],
      ],
      p.heat > 0.6 ? E[5] : E[3],
    );
    s.commit(false);
  }
  s.begin();
  s.poly(
    [
      [hx - 1.2, hy + 0.2],
      [hx + 7.6, hy + 0.4 + drop * 0.8],
      [hx + 7.2, hy + 1.8 + drop],
      [hx + 2, hy + 2.6 + drop * 0.4],
      [hx - 1, hy + 2.4],
    ],
    H[2],
  );
  s.shadeEdges(H[2], H[3], H[0]);
  s.commit();
  s.begin();
  s.poly(
    [
      [hx - 2.6, hy - 2.4],
      [hx + 0.5, hy - 4.4],
      [hx + 4.5, hy - 3.8],
      [hx + 8.8, hy - 1.6],
      [hx + 9.2, hy - 0.2],
      [hx + 2, hy + 0.6],
      [hx - 2.4, hy + 0.8],
    ],
    H[2],
  );
  s.shadeEdges(H[2], H[4], H[1], 2);
  s.commit();
  s.begin();
  s.poly(
    [
      [hx - 0.4, hy - 4.8],
      [hx + 4.8, hy - 4.2],
      [hx + 4.4, hy - 2.8],
      [hx + 0.4, hy - 3],
    ],
    H[3],
  );
  s.shadeEdges(H[3], H[4], H[1]);
  s.commit();
  s.begin();
  s.taper(hx - 0.5, hy - 4, hx - 7.5, hy - 7.5, 1.2, 0.3, N[2], 0.9);
  s.taper(hx + 1.6, hy - 4.2, hx - 3, hy - 8.6, 1, 0.3, N[2], 0.7);
  s.shadeEdges(N[2], N[3], N[1]);
  s.commit();
  s.begin();
  s.block(hx + 2.4, hy - 2.6, E[p.heat > 0.5 ? 5 : 4], 2, 1);
  s.set(hx + 3.6, hy - 2.6, p.heat > 0.5 ? DRAKE.eyeHot : DRAKE.eye);
  s.hairline(hx + 1.8, hy - 3, hx + 4.6, hy - 3.4, H[0]);
  s.set(hx + 8.2, hy - 1, E[3]);
  for (let i = 0; i < 3; i++) {
    s.set(hx + 3.5 + i * 1.5, hy + 0.6 + drop * 0.1 * i, DRAKE.tooth);
    s.set(hx + 3 + i * 1.5, hy + 1 + drop * (0.4 + i * 0.15), DRAKE.tooth);
  }
  s.hairline(hx - 1.5, hy - 4.4, hx + 3.5, hy - 4.4, H[4]);
  s.commit(false);
}
