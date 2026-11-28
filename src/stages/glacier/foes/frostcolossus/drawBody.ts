import type { SpriteCanvas } from "../../../../engine/sprite";
import { FOE } from "../colors";
import { shardPoints } from "../shapes";
import { COLOSSUS_COLORS } from "./colors";
import { plate } from "./plate";
import type { ColossusPose } from "./pose";

const St = COLOSSUS_COLORS.stone;
const Ic = COLOSSUS_COLORS.ice;
const Co = COLOSSUS_COLORS.core;
const ICE = { dark: Ic[1], base: Ic[2], lit: Ic[3], rim: Ic[4] } as const;

export function drawLeg(s: SpriteCanvas, p: ColossusPose, near: boolean): void {
  const x = near ? 5 : -6;
  const foot = near ? p.nearFoot : p.farFoot;
  const tone = near ? St[3] : St[2];
  s.begin();
  s.poly(
    [
      [x - 6, -21 + p.lift],
      [x + 5, -21 + p.lift],
      [x + 4 + foot * 0.5, -5],
      [x - 5 + foot * 0.5, -5],
    ],
    tone,
  );
  s.shadeEdges(tone, near ? St[4] : St[3], St[1], 2);
  s.commit();
  if (near)
    plate(
      s,
      [
        [x - 4, -15],
        [x + 3, -16],
        [x + 4, -10],
        [x - 3, -9],
      ],
      [
        [x - 3, -14],
        [x + 3, -15],
      ],
      ICE,
    );
  s.begin();
  s.poly(
    [
      [x - 7 + foot, -6],
      [x + 7 + foot, -6],
      [x + 9 + foot, 0],
      [x - 8 + foot, 0],
    ],
    near ? St[2] : St[1],
  );
  s.shadeEdges(near ? St[2] : St[1], St[3], St[0]);
  s.hairline(x + 2 + foot, -2, x + 8 + foot, -2, St[0]);
  s.commit();
}

export function drawBackSpikes(s: SpriteCanvas, p: ColossusPose): void {
  const y = p.lift + p.hunch;
  const lit = p.core > 0.7;
  for (const [x, top, len, angle] of [
    [-16, -44, 9, -2.5],
    [-11, -50, 13, -2.15],
    [-4, -54, 10, -1.85],
    [-18, -36, 7, -2.75],
  ] as const) {
    s.begin();
    s.poly(shardPoints(x, top + y, len, angle, 2.6), Ic[2]);
    s.shadeEdges(Ic[2], lit ? Ic[5] : Ic[4], Ic[0]);
    s.commit();
  }
}

export function drawTorso(s: SpriteCanvas, p: ColossusPose): void {
  const y = p.lift;
  const h = p.hunch;
  s.begin();
  s.poly(
    [
      [-8, -19 + y],
      [8, -19 + y],
      [14, -29 + y + h * 0.3],
      [18, -39 + y + h],
      [12, -47 + y + h],
      [0, -54 + y + h],
      [-11, -52 + y + h],
      [-18, -43 + y + h],
      [-15, -30 + y + h * 0.3],
    ],
    St[3],
  );
  s.poly(
    [
      [-8, -19 + y],
      [6, -19 + y],
      [2, -26 + y],
      [-12, -28 + y],
    ],
    St[2],
  );
  s.poly(
    [
      [-18, -43 + y + h],
      [-11, -52 + y + h],
      [-9, -40 + y + h],
      [-14, -30 + y],
    ],
    St[2],
  );
  s.shadeEdges(St[3], St[4], St[1], 3);
  s.hairline(-7, -22 + y, 7, -22 + y, St[1]);
  s.hairline(-5, -25 + y, 5, -25.5 + y, St[1]);
  s.hairline(-3, -50 + y + h, 8, -46 + y + h, St[5]);
  s.commit();
  plate(
    s,
    [
      [-6, -46 + y + h],
      [3, -48 + y + h],
      [8, -40 + y + h],
      [-3, -37 + y + h],
    ],
    [
      [-5, -45 + y + h],
      [3, -47 + y + h],
    ],
    ICE,
  );
  plate(
    s,
    [
      [6, -46 + y + h],
      [14, -44 + y + h],
      [15, -36 + y + h],
      [9, -33 + y + h],
    ],
    [
      [7, -45 + y + h],
      [13, -43 + y + h],
    ],
    ICE,
  );
}

export function drawCore(s: SpriteCanvas, p: ColossusPose): void {
  const y = p.lift + p.hunch * 0.6;
  const cx = -4;
  const cy = -33 + y;
  const r = 3.4 + p.open * 2;
  s.begin();
  s.dot(cx, cy, r + 2, COLOSSUS_COLORS.socket);
  s.commit(false);
  s.begin();
  const hot = Co[Math.min(Co.length - 1, 1 + Math.round(p.core * 3))];
  s.poly(
    [
      [cx, cy - r - 1],
      [cx + r, cy],
      [cx, cy + r + 1],
      [cx - r, cy],
    ],
    hot,
  );
  s.poly(
    [
      [cx, cy - r * 0.5],
      [cx + r * 0.5, cy],
      [cx, cy + r * 0.5],
      [cx - r * 0.5, cy],
    ],
    Co[4],
  );
  s.commit(false);
  s.begin();
  const crack = p.core > 0.5 ? Co[2] : Co[1];
  s.hairline(cx - r - 2, cy - 1, cx - r - 6, cy - 4, crack);
  s.hairline(cx + r + 2, cy + 1, cx + r + 5, cy + 5, crack);
  s.hairline(cx + 1, cy - r - 2, cx + 3, cy - r - 6, crack);
  s.hairline(cx - 1, cy + r + 2, cx - 3, cy + r + 5, crack);
  if (p.open > 0) s.set(cx, cy, FOE.eyeHot);
  s.commit(false);
}
