import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { AC, VOID } from "../../../../game/enemies/abyss/colors";
import { fang, type Pt, sunRim } from "../../../../game/enemies/abyss/paint";
import type { Enemy } from "../../../../types/enemy";
import { CITADEL_FOE, ECLIPSE } from "../colors";
import { type KnightPose, knightPose } from "./pose";

const canvas = detailCanvas(84, 64, 40, 56);
const I = CITADEL_FOE.iron;
const T = CITADEL_FOE.tabard;
const BLADE = 24;

function leg(s: SpriteCanvas, hip: Pt, foot: Pt, near: boolean): void {
  const tone = near ? I[2] : I[1];
  const knee: Pt = [(hip[0] + foot[0]) / 2 + 1.2, (hip[1] + foot[1]) / 2 - 0.5];
  s.begin();
  s.taper(hip[0], hip[1], knee[0], knee[1], 2.6, 2.1, tone);
  s.taper(knee[0], knee[1], foot[0], foot[1] - 1.5, 2.1, 1.9, tone);
  s.poly(
    [
      [foot[0] - 2.5, foot[1] - 3],
      [foot[0] + 3.5, foot[1] - 2],
      [foot[0] + 4.5, foot[1]],
      [foot[0] - 2.5, foot[1]],
    ],
    tone,
  );
  s.shadeEdges(tone, near ? I[4] : I[2], I[0], 2);
  s.commit();
  s.begin();
  s.dot(knee[0] + 0.8, knee[1], 1.6, near ? I[3] : I[2]);
  s.shadeEdges(near ? I[3] : I[2], I[5], I[1]);
  fang(s, [knee[0] + 1.5, knee[1] - 0.5], [knee[0] + 4, knee[1] - 1.5], 1, near ? I[3] : I[2]);
  s.commit();
}

function sword(s: SpriteCanvas, p: KnightPose): void {
  const [gx, gy] = p.grip;
  const ux = Math.cos(p.blade);
  const uy = Math.sin(p.blade);
  const nx = -uy;
  const ny = ux;
  const tip: Pt = [gx + ux * BLADE, gy + uy * BLADE];
  const hot = p.bladeHot > 0.6;
  s.begin();
  s.stroke(gx - ux * 4, gy - uy * 4, gx, gy, 0.8, CITADEL_FOE.tabard[1]);
  s.stroke(gx - nx * 3.5, gy - ny * 3.5, gx + nx * 3.5, gy + ny * 3.5, 0.7, I[3]);
  s.shadeEdges(I[3], I[4], I[1]);
  s.commit();
  s.begin();
  s.poly(
    [
      [gx + nx * 1.8, gy + ny * 1.8],
      [tip[0] + nx * 0.8 - ux * 3, tip[1] + ny * 0.8 - uy * 3],
      tip,
      [tip[0] - nx * 1.6 - ux * 4, tip[1] - ny * 1.6 - uy * 4],
      [gx - nx * 1.8, gy - ny * 1.8],
    ],
    hot ? VOID[3] : I[3],
  );
  s.shadeEdges(hot ? VOID[3] : I[3], hot ? VOID[5] : I[5], hot ? VOID[2] : I[1]);
  s.hairline(gx + ux * 2, gy + uy * 2, tip[0] - ux * 3, tip[1] - uy * 3, hot ? VOID[5] : VOID[2]);
  s.commit();
}

function arm(s: SpriteCanvas, from: Pt, hand: Pt, tone: number): void {
  const elbow: Pt = [(from[0] + hand[0]) / 2 - 1.5, (from[1] + hand[1]) / 2 + 2.5];
  s.begin();
  s.taper(from[0], from[1], elbow[0], elbow[1], 2.2, 1.8, tone);
  s.taper(elbow[0], elbow[1], hand[0], hand[1], 1.8, 1.7, tone);
  s.dot(hand[0], hand[1], 2, I[3]);
  s.shadeEdges(tone, I[3], I[0]);
  s.commit();
}

function torso(s: SpriteCanvas, p: KnightPose): void {
  const l = p.lean;
  s.begin();
  s.poly(
    [
      [-6 + l * 0.5, -21],
      [6 + l * 0.5, -21],
      [8, -9],
      [3, -10.5],
      [0, -7.5],
      [-3, -10.5],
      [-8, -9],
    ],
    T[2],
  );
  s.shadeEdges(T[2], T[3], T[0], 2);
  s.hairline(0 + l * 0.5, -20, 0, -9, T[1]);
  s.commit();
  s.begin();
  s.poly(
    [
      [-7 + l, -36],
      [7 + l, -36],
      [9 + l * 0.8, -29],
      [7 + l * 0.6, -20.5],
      [-6 + l * 0.6, -20.5],
      [-8.5 + l * 0.8, -29],
    ],
    I[2],
  );
  s.shadeEdges(I[2], I[4], I[0], 3);
  s.hairline(-6 + l * 0.6, -22, 6.5 + l * 0.6, -22, I[3]);
  s.hairline(1 + l, -35, 1 + l * 0.7, -23, I[1]);
  s.commit();
  s.begin();
  s.dot(1.5 + l * 0.9, -29, 2.2, VOID[1]);
  s.dot(1.5 + l * 0.9, -29, 1.2, p.visor > 0.7 ? VOID[4] : VOID[3]);
  s.commit(false);
  s.begin();
  s.dot(-6 + l, -33.5, 4, I[3]);
  s.shadeEdges(I[3], I[5], I[1], 2);
  fang(s, [-7 + l, -36], [-10 + l, -41], 1.8, I[3]);
  s.hairline(-9.5 + l, -32, -2.5 + l, -32, I[1]);
  s.commit();
}

function helm(s: SpriteCanvas, p: KnightPose): void {
  const hx = 1.5 + p.lean * 1.2;
  const hy = -40;
  s.begin();
  s.poly(
    [
      [hx - 4.5, hy + 3.5],
      [hx - 4.8, hy - 2.5],
      [hx - 2, hy - 5.5],
      [hx + 3, hy - 5.2],
      [hx + 5, hy - 2],
      [hx + 5, hy + 1],
      [hx + 3.5, hy + 3.5],
    ],
    I[3],
  );
  s.shadeEdges(I[3], I[5], I[1], 2);
  s.commit();
  s.begin();
  s.taper(hx - 2, hy - 4.5, hx - 6, hy - 10, 1.4, 0.4, CITADEL_FOE.bone[1], -0.6);
  s.taper(hx + 1.5, hy - 5, hx + 3, hy - 11, 1.4, 0.4, CITADEL_FOE.bone[2], 0.5);
  s.shadeEdges(CITADEL_FOE.bone[1], CITADEL_FOE.bone[2], CITADEL_FOE.bone[0]);
  s.commit();
  s.begin();
  s.hairline(hx, hy - 0.8, hx + 5, hy - 0.8, AC.outline);
  s.hairline(hx + 0.5, hy - 0.2, hx + 4.8, hy - 0.2, p.visor > 0.7 ? VOID[5] : VOID[3]);
  s.set(hx + 4, hy - 0.8, p.visor > 0.5 ? AC.eyeHot : AC.eye);
  s.set(hx + 2.5, hy - 0.8, p.visor > 0.5 ? AC.eye : AC.eyeDim);
  for (const y of [1, 2.2]) s.hairline(hx + 2, hy + y, hx + 4.5, hy + y, I[1]);
  s.commit();
}

function shield(s: SpriteCanvas, p: KnightPose, time: number): void {
  const [cx, cy] = p.shield;
  const w = 6.5 - p.shieldOut * 1.5;
  const pts: Pt[] = [
    [cx - w, cy - 14],
    [cx + w, cy - 14],
    [cx + w + 0.5, cy + 6],
    [cx, cy + 14],
    [cx - w - 0.5, cy + 6],
  ];
  s.begin();
  s.poly(pts, I[2]);
  s.shadeEdges(I[2], I[4], I[0], 3);
  s.hairline(cx - w + 0.5, cy - 13.5, cx + w - 0.5, cy - 13.5, I[5]);
  s.hairline(cx - w + 1, cy - 12.5, cx - w + 1, cy + 5.5, I[4]);
  s.commit();
  const r = 4.2;
  const ey = cy - 3;
  const turn = Math.sin(time * 1.5) * 0.4;
  s.begin();
  s.dot(cx, ey, r + 1.2, ECLIPSE[1]);
  s.dot(cx, ey, r + 0.4, p.visor > 0.7 ? ECLIPSE[4] : ECLIPSE[3]);
  s.dot(cx + 0.6 + turn, ey - 0.3, r - 0.5, AC.bodyDeep);
  s.set(cx - r - 0.2, ey - 1.5, ECLIPSE[5]);
  s.set(cx - r + 0.4, ey - 2.8, ECLIPSE[5]);
  s.commit(false);
  s.begin();
  for (const [a, b] of [
    [-r - 3, -r - 1],
    [r + 1, r + 3],
  ] as const) {
    s.hairline(cx + a, ey, cx + b, ey, ECLIPSE[2]);
  }
  s.hairline(cx, ey + r + 1.5, cx, cy + 11, ECLIPSE[1]);
  s.commit(false);
}

export function drawEclipseknight(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = knightPose(e, time);
  s.clear();
  s.shift(0, p.bob);
  leg(s, [-3, -11], p.farFoot, false);
  sword(s, p);
  arm(s, [-5 + p.lean, -32], p.grip, I[1]);
  torso(s, p);
  leg(s, [3, -11], p.nearFoot, true);
  helm(s, p);
  arm(s, [4 + p.lean, -31], [p.shield[0] - 2, p.shield[1] - 2], I[2]);
  shield(s, p, time);
  s.shift(0, 0);
  sunRim(s, AC.rim, AC.rimSoft, 0.35);
  s.outline(AC.outline);
  return s;
}
