import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { AC, VOID } from "../../../../game/enemies/abyss/colors";
import { fang, type Pt, sunRim } from "../../../../game/enemies/abyss/paint";
import type { Enemy } from "../../../../types/enemy";
import { CITADEL_FOE } from "../colors";
import { type SquirePose, squirePose } from "./pose";

const canvas = detailCanvas(64, 44, 26, 38);
const I = CITADEL_FOE.iron;
const T = CITADEL_FOE.tabard;

function leg(s: SpriteCanvas, hip: Pt, foot: Pt, near: boolean): void {
  const tone = near ? I[2] : I[1];
  const knee: Pt = [(hip[0] + foot[0]) / 2 + 0.8, (hip[1] + foot[1]) / 2];
  s.begin();
  s.taper(hip[0], hip[1], knee[0], knee[1], 1.8, 1.5, tone);
  s.taper(knee[0], knee[1], foot[0], foot[1] - 1, 1.5, 1.3, tone);
  s.poly(
    [
      [foot[0] - 1.5, foot[1] - 2],
      [foot[0] + 2.8, foot[1] - 1.2],
      [foot[0] + 3, foot[1]],
      [foot[0] - 1.6, foot[1]],
    ],
    tone,
  );
  s.shadeEdges(tone, near ? I[3] : I[2], I[0], 2);
  s.dot(knee[0] + 0.5, knee[1], 1, near ? I[3] : I[2]);
  s.commit();
}

function spear(s: SpriteCanvas, p: SquirePose): void {
  const [hx, hy] = p.hand;
  const [tx, ty] = p.tip;
  const len = Math.hypot(tx - hx, ty - hy) || 1;
  const ux = (tx - hx) / len;
  const uy = (ty - hy) / len;
  s.begin();
  s.stroke(hx - ux * 6, hy - uy * 6, tx - ux * 3, ty - uy * 3, 0.55, CITADEL_FOE.bone[0]);
  s.shadeEdges(CITADEL_FOE.bone[0], CITADEL_FOE.bone[1], AC.outline);
  s.commit();
  s.begin();
  s.poly(
    [
      [tx + ux * 3, ty + uy * 3],
      [tx - ux * 2 - uy * 1.6, ty - uy * 2 + ux * 1.6],
      [tx - ux * 3.5, ty - uy * 3.5],
      [tx - ux * 2 + uy * 1.6, ty - uy * 2 - ux * 1.6],
    ],
    p.visor > 0.8 ? VOID[4] : VOID[3],
  );
  s.shadeEdges(p.visor > 0.8 ? VOID[4] : VOID[3], VOID[5], VOID[2]);
  s.hairline(tx - ux * 3, ty - uy * 3, tx + ux * 2.5, ty + uy * 2.5, VOID[5]);
  s.commit();
}

function body(s: SpriteCanvas, p: SquirePose): void {
  const l = p.lean;
  s.begin();
  s.poly(
    [
      [-4.5 + l * 0.6, -15],
      [4.5 + l * 0.6, -15],
      [6, -6],
      [1, -7.5],
      [-1.5, -5.5],
      [-6, -6.5],
    ],
    T[2],
  );
  s.shadeEdges(T[2], T[3], T[0], 2);
  s.hairline(0.5 + l * 0.6, -14, 0, -7, T[1]);
  s.commit();
  s.begin();
  s.poly(
    [
      [-5 + l, -24],
      [4.5 + l, -24],
      [5.5 + l * 0.8, -19],
      [4.5 + l * 0.6, -14.5],
      [-4.5 + l * 0.6, -14.5],
      [-5.5 + l * 0.8, -19],
    ],
    I[2],
  );
  s.shadeEdges(I[2], I[4], I[0], 2);
  s.hairline(0 + l, -23, 0.5 + l * 0.7, -16, I[1]);
  s.hairline(-4 + l * 0.6, -15.5, 4 + l * 0.6, -15.5, I[3]);
  s.commit();
  s.begin();
  s.dot(-4.2 + l, -22.5, 2.4, I[3]);
  s.shadeEdges(I[3], I[4], I[1]);
  s.commit();
}

function helm(s: SpriteCanvas, p: SquirePose): void {
  const hx = 0.8 + p.lean * 1.2;
  const hy = -27.5;
  s.begin();
  s.poly(
    [
      [hx - 3.6, hy + 3],
      [hx - 3.8, hy - 2],
      [hx - 1.5, hy - 4.2],
      [hx + 2.5, hy - 4],
      [hx + 4, hy - 1.5],
      [hx + 3.6, hy + 3],
    ],
    I[3],
  );
  s.shadeEdges(I[3], I[4], I[1], 2);
  s.commit();
  s.begin();
  fang(s, [hx - 1, hy - 3.8], [hx - 4.5, hy - 8.5], 1.5, CITADEL_FOE.bone[1]);
  s.shadeEdges(CITADEL_FOE.bone[1], CITADEL_FOE.bone[2], CITADEL_FOE.bone[0]);
  s.commit();
  s.begin();
  s.hairline(hx - 0.5, hy - 0.6, hx + 3.6, hy - 0.6, AC.outline);
  s.hairline(hx + 0.5, hy - 0.2, hx + 3.4, hy - 0.2, p.visor > 0.7 ? VOID[5] : VOID[3]);
  s.set(hx + 3, hy - 0.6, p.visor > 0.5 ? AC.eyeHot : AC.eye);
  s.hairline(hx + 1.6, hy + 0.6, hx + 1.6, hy + 2.6, I[1]);
  s.commit();
}

function arm(s: SpriteCanvas, p: SquirePose): void {
  const shoulder: Pt = [-3.5 + p.lean, -21.5];
  const [hx, hy] = p.hand;
  const elbow: Pt = [(shoulder[0] + hx) / 2 - 1, (shoulder[1] + hy) / 2 + 2];
  s.begin();
  s.taper(shoulder[0], shoulder[1], elbow[0], elbow[1], 1.5, 1.2, I[2]);
  s.taper(elbow[0], elbow[1], hx, hy, 1.2, 1.1, I[2]);
  s.dot(hx, hy, 1.3, I[3]);
  s.shadeEdges(I[2], I[3], I[0]);
  s.commit();
}

function shield(s: SpriteCanvas, p: SquirePose): void {
  const [cx, cy] = p.shield;
  const k = p.shieldTilt;
  const w = 3 - k * 1;
  const pts: Pt[] = [
    [cx - w, cy - 6.5],
    [cx + w, cy - 6.5 + k],
    [cx + w + 0.3, cy + 1],
    [cx + k, cy + 7],
    [cx - w - 0.3, cy + 1],
  ];
  s.begin();
  s.poly(pts, I[2]);
  s.shadeEdges(I[2], I[4], I[0], 2);
  s.hairline(cx - w + 0.5, cy - 6, cx + w - 0.5, cy - 6 + k, I[5]);
  s.commit();
  s.begin();
  s.dot(cx, cy - 1.5, 1.6, VOID[2]);
  s.dot(cx, cy - 1.5, 0.9, AC.bodyDeep);
  s.set(cx - 1, cy - 2.6, VOID[4]);
  s.hairline(cx, cy + 1, cx + k * 0.5, cy + 5, VOID[1]);
  s.commit(false);
}

export function drawHollowsquire(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const p = squirePose(e, t + e.seed);
  s.clear();
  s.shift(0, p.bob);
  leg(s, [-2, -8], p.farFoot, false);
  spear(s, p);
  arm(s, p);
  body(s, p);
  leg(s, [2, -8], p.nearFoot, true);
  helm(s, p);
  shield(s, p);
  s.shift(0, 0);
  sunRim(s, AC.rim, AC.rimSoft, 0.35);
  s.outline(AC.outline);
  return s;
}
