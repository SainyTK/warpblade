import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { FOE } from "../colors";
import { facet, type Pt } from "../shapes";
import { COLOSSUS_COLORS } from "./colors";
import { type ColossusPose, colossusPose } from "./pose";

const canvas = detailCanvas(84, 84, 42, 76);
const St = COLOSSUS_COLORS.stone;
const Ic = COLOSSUS_COLORS.ice;
const Sn = COLOSSUS_COLORS.snow;
const Co = COLOSSUS_COLORS.core;

function legs(s: SpriteCanvas, p: ColossusPose, near: boolean): void {
  const x = near ? 5 : -7;
  const foot = near ? p.nearFoot : p.farFoot;
  const tone = near ? St[3] : St[2];
  s.begin();
  s.poly(
    [
      [x - 5, -20 + p.lift],
      [x + 5, -20 + p.lift],
      [x + 5 + foot * 0.5, -4],
      [x - 5 + foot * 0.5, -4],
    ],
    tone,
  );
  s.shadeEdges(tone, near ? St[4] : St[3], St[1], 2);
  s.hairline(x - 4, -12 + p.lift * 0.5, x + 4, -13 + p.lift * 0.5, St[1]);
  s.commit();
  s.begin();
  s.poly(
    [
      [x - 6 + foot, -5],
      [x + 7 + foot, -5],
      [x + 8 + foot, 0],
      [x - 7 + foot, 0],
    ],
    near ? Ic[1] : St[2],
  );
  s.shadeEdges(near ? Ic[1] : St[2], Ic[3], St[1]);
  s.commit();
}

function torso(s: SpriteCanvas, p: ColossusPose): void {
  const y = p.lift + p.hunch * 0.5;
  const h = p.hunch;
  s.begin();
  s.poly(
    [
      [-14, -44 + y + h],
      [12, -46 + y + h],
      [19, -36 + y + h],
      [13, -19 + y],
      [-12, -18 + y],
      [-18, -32 + y + h],
    ],
    St[3],
  );
  s.shadeEdges(St[3], St[4], St[1], 3);
  s.hairline(-10, -40 + y + h, -4, -24 + y, St[2]);
  s.hairline(9, -42 + y + h, 13, -27 + y, St[2]);
  s.hairline(-13, -34 + y + h, -9, -30 + y + h, COLOSSUS_COLORS.bone);
  s.hairline(-9, -30 + y + h, -11, -25 + y, COLOSSUS_COLORS.bone);
  s.commit();
}

function core(s: SpriteCanvas, p: ColossusPose): void {
  const y = p.lift + p.hunch * 0.5;
  const cx = 2;
  const cy = -31 + y + p.hunch * 0.6;
  const r = 3 + p.open * 2.5;
  const lit = Co[Math.min(Co.length - 1, Math.floor(p.core * 3) + 1)];
  if (p.open > 0) {
    for (const side of [-1, 1])
      facet(
        s,
        [
          [cx + side * (r + 1), cy - r - 2],
          [cx + side * (r + 4 + p.open * 2), cy - 1],
          [cx + side * (r + 1), cy + r + 2],
        ],
        St[4],
        St[5],
        St[2],
      );
  }
  s.begin();
  s.poly(
    [
      [cx, cy - r - 1],
      [cx + r, cy],
      [cx, cy + r + 1],
      [cx - r, cy],
    ],
    lit,
  );
  s.set(cx - 0.5, cy - 0.5, FOE.eyeHot);
  if (p.core > 0.6) s.hairline(cx - r + 1, cy, cx + r - 1, cy, Co[4]);
  s.commit(false);
  if (p.open > 0) return;
  s.begin();
  s.hairline(cx - r - 2, cy - 1, cx + r + 3, cy + 2, St[1]);
  s.hairline(cx + 1, cy - r - 3, cx - 1, cy + r + 2, St[1]);
  s.commit(false);
}

function shoulder(s: SpriteCanvas, p: ColossusPose, near: boolean): Pt {
  const y = p.lift + p.hunch;
  const x = near ? 13 : -15;
  const cy = -42 + y;
  s.begin();
  s.dot(x, cy, near ? 8 : 7, near ? St[3] : St[2]);
  s.shadeEdges(near ? St[3] : St[2], St[4], St[1], 2);
  s.commit();
  s.begin();
  s.poly(
    [
      [x - 7, cy - 4],
      [x - 3, cy - 8.5],
      [x + 4, cy - 8.5],
      [x + 7.5, cy - 3],
      [x + 2, cy - 5.5],
      [x - 3, cy - 4.5],
    ],
    Sn[3],
  );
  s.shadeEdges(Sn[3], Sn[4], Sn[1]);
  s.commit();
  return [x, cy + 2];
}

function head(s: SpriteCanvas, p: ColossusPose): void {
  const y = p.lift + p.hunch * 1.4;
  s.begin();
  s.poly(
    [
      [-3, -50 + y],
      [6, -51 + y],
      [9, -44 + y],
      [6, -40 + y],
      [-3, -41 + y],
    ],
    St[2],
  );
  s.shadeEdges(St[2], St[4], St[0]);
  s.commit();
  s.begin();
  const eye = p.glare ? FOE.eyeHot : Co[3];
  s.block(3, -46.5 + y, eye, 2, 0.5);
  s.block(6.5, -46 + y, eye, 1.5, 0.5);
  s.commit(false);
}

function arm(s: SpriteCanvas, p: ColossusPose, from: Pt, fist: Pt, near: boolean): void {
  const tone = near ? St[3] : St[2];
  const elbow: Pt = [(from[0] + fist[0]) / 2 + (near ? 4 : -4), (from[1] + fist[1]) / 2 + 3];
  s.begin();
  s.stroke(from[0], from[1], elbow[0], elbow[1], near ? 4.4 : 4, tone);
  s.stroke(elbow[0], elbow[1], fist[0], fist[1], near ? 4 : 3.6, tone);
  s.shadeEdges(tone, St[4], St[1], 2);
  s.commit();
  const [fx, fy] = fist;
  const lit = p.core > 0.8 && near;
  facet(
    s,
    [
      [fx - 5, fy - 5],
      [fx + 5, fy - 6],
      [fx + 7, fy + 1],
      [fx + 4, fy + 5],
      [fx - 5, fy + 5],
      [fx - 7, fy],
    ],
    near ? (lit ? Ic[3] : Ic[2]) : Ic[1],
    Ic[5],
    Ic[0],
  );
  s.begin();
  s.hairline(fx - 3, fy - 2, fx + 4, fy - 3, Ic[4]);
  s.hairline(fx - 4, fy + 2, fx + 3, fy + 2, Ic[1]);
  s.commit(false);
}

export function drawFrostcolossus(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const p = colossusPose(e, t + e.seed);
  s.clear();
  s.shift(p.jolt, 0);
  const farShoulder = shoulder(s, p, false);
  arm(s, p, farShoulder, p.farFist, false);
  legs(s, p, false);
  legs(s, p, true);
  torso(s, p);
  core(s, p);
  head(s, p);
  const nearShoulder = shoulder(s, p, true);
  arm(s, p, nearShoulder, p.nearFist, true);
  s.shift(0, 0);
  s.outline(FOE.outline);
  return s;
}
