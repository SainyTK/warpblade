import type { SpriteCanvas } from "../../../../engine/sprite";
import { DRAKE } from "./colors";
import type { DrakePose } from "./pose";

type Pt = readonly [number, number];
const H = DRAKE.hide;
const E = DRAKE.ember;

export function drawLeg(s: SpriteCanvas, p: DrakePose, hip: Pt, hind: boolean, near: boolean): void {
  const reach = p.sweep;
  const knee: Pt = hind ? [hip[0] + 2 + reach * 2, hip[1] + 3.5] : [hip[0] + 2.5 + reach * 3, hip[1] + 3];
  const foot: Pt = hind ? [hip[0] - 1 + reach * 6, hip[1] + 7 - reach] : [hip[0] + 1.5 + reach * 6, hip[1] + 6 - reach];
  const tone = near ? H[2] : H[1];
  s.begin();
  s.dot(hip[0], hip[1], hind ? 2.8 : 2.2, tone);
  s.stroke(hip[0], hip[1], knee[0], knee[1], hind ? 1.6 : 1.3, tone);
  s.stroke(knee[0], knee[1], foot[0], foot[1], 1, tone);
  s.shadeEdges(tone, near ? H[3] : H[2], H[0], 2);
  s.commit();
  s.begin();
  const claw = near ? DRAKE.horn[3] : DRAKE.horn[1];
  for (let i = 0; i < 3; i++) s.hairline(foot[0] - 0.5 + i, foot[1], foot[0] + 0.5 + i * 1.2, foot[1] + 1.4, claw);
  s.commit(false);
}

export function drawTail(s: SpriteCanvas, p: DrakePose): void {
  const mid: Pt = [-15, 3 + p.tail * 0.5];
  const end: Pt = [-27, 1 + p.tail];
  s.begin();
  s.taper(-5, 0.5, mid[0], mid[1], 3.4, 1.8, H[2], 1);
  s.taper(mid[0], mid[1], end[0], end[1], 1.8, 0.5, H[2], -1.4);
  s.shadeEdges(H[2], H[3], H[1], 2);
  s.commit();
  s.begin();
  s.poly(
    [
      [end[0] + 1.5, end[1] - 0.5],
      [end[0] - 2.5, end[1] - 3],
      [end[0] - 4, end[1] + 0.5],
      [end[0] - 1.5, end[1] + 2.5],
    ],
    DRAKE.horn[1],
  );
  s.shadeEdges(DRAKE.horn[1], DRAKE.horn[2], DRAKE.horn[0]);
  s.commit();
  s.begin();
  s.hairline(-6, 2.8, mid[0], mid[1] + 1.4, p.heat > 0.5 ? E[4] : E[2]);
  s.hairline(mid[0], mid[1] + 1.2, end[0] + 2, end[1] + 0.6, E[1]);
  for (let i = 0; i < 4; i++) {
    const u = 0.15 + i * 0.22;
    const x = -5 + (end[0] + 5) * u;
    const y = 0.5 + (end[1] - 0.5) * u + p.tail * 0.3 * Math.sin(u * Math.PI) - (3.2 - i * 0.6);
    s.set(x, y, H[4]);
  }
  s.commit(false);
}

export function drawTorso(s: SpriteCanvas, p: DrakePose, time: number): void {
  s.begin();
  s.dot(4, -1.5, 5.4, H[2]);
  s.dot(-3, 0, 4.6, H[2]);
  s.stroke(-3, 0, 4, -1.5, 4.4, H[2]);
  s.shadeEdges(H[2], H[3], H[1], 2);
  s.commit();
  const belly = p.heat > 0.6 ? E[3] : E[2];
  s.begin();
  s.poly(
    [
      [-6.5, 2.6],
      [-1, 3.8],
      [5, 3.4],
      [8.6, 0.6],
      [8, 2.8],
      [4.5, 4.8],
      [-1, 5],
      [-5.5, 4.2],
    ],
    belly,
  );
  s.shadeEdges(belly, E[4], E[1]);
  s.commit();
  s.begin();
  for (let x = -5; x <= 6; x += 2.2)
    s.hairline(x, 3.4 + Math.abs(x) * 0.05, x + 0.6, 4.9 - Math.abs(x - 1) * 0.08, E[1]);
  const flicker = Math.sin(time * 9) > 0 ? E[4] : E[3];
  s.set(1.5, 4.2, flicker);
  s.hairline(-5, -2.4, -2, 0.4, E[2]);
  s.hairline(-2, 0.4, 1, -1.2, E[2]);
  s.hairline(1, -1.2, 3.5, 1, p.heat > 0.4 ? E[4] : E[3]);
  s.hairline(1, -5.4, 7, -5.6, H[4]);
  s.hairline(-6, -3.8, -1, -4.6, H[3]);
  s.hairline(3, -1, 6.5, 0.4, H[1]);
  s.commit(false);
  s.begin();
  for (let i = 0; i < 4; i++) {
    const x = -5 + i * 3;
    const y = -4.4 - (i > 1 ? 1.4 : 0.4);
    s.poly(
      [
        [x - 1, y + 0.6],
        [x + 0.3, y - 2],
        [x + 1.2, y + 0.4],
      ],
      DRAKE.horn[1],
    );
  }
  s.shadeEdges(DRAKE.horn[1], DRAKE.horn[2], DRAKE.horn[0]);
  s.commit();
}
