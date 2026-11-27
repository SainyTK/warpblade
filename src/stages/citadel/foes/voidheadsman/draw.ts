import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { AC, clipBelow, hideOf, VOID } from "../../../../game/enemies/abyss/colors";
import { fang, glowEye, type Pt, sunRim } from "../../../../game/enemies/abyss/paint";
import type { Enemy } from "../../../../types/enemy";
import { CITADEL_FOE, ECLIPSE } from "../colors";
import { type HeadsmanPose, headsmanPose } from "./pose";

const canvas = detailCanvas(120, 96, 56, 80);
const I = CITADEL_FOE.iron;
const T = CITADEL_FOE.tabard;
const HAFT = 30;
type Hide = ReturnType<typeof hideOf>;
const HIDE: Hide = hideOf(0);

function leg(s: SpriteCanvas, hip: Pt, foot: Pt, near: boolean, H: Hide): void {
  const tone = near ? H.dark : H.deep;
  const knee: Pt = [(hip[0] + foot[0]) / 2 + 1.5, (hip[1] + foot[1]) / 2 - 1];
  s.begin();
  s.taper(hip[0], hip[1], knee[0], knee[1], 3.6, 3, tone);
  s.taper(knee[0], knee[1], foot[0], foot[1] - 2, 3, 2.6, tone);
  s.shadeEdges(tone, near ? H.body : H.dark, H.deep, 2);
  s.commit();
  s.begin();
  s.poly(
    [
      [foot[0] - 3, foot[1] - 6],
      [foot[0] + 3.5, foot[1] - 6],
      [foot[0] + 5.5, foot[1]],
      [foot[0] - 3.5, foot[1]],
    ],
    near ? I[2] : I[1],
  );
  s.shadeEdges(near ? I[2] : I[1], near ? I[4] : I[2], I[0], 2);
  s.commit();
}

function axe(s: SpriteCanvas, p: HeadsmanPose, time: number): void {
  const [gx, gy] = p.grip;
  const ux = Math.cos(p.axe);
  const uy = Math.sin(p.axe);
  const nx = -uy;
  const ny = ux;
  const head: Pt = [gx + ux * HAFT, gy + uy * HAFT];
  s.begin();
  s.stroke(gx - ux * 8, gy - uy * 8, head[0], head[1], 0.9, T[1]);
  s.shadeEdges(T[1], T[3], AC.outline);
  for (let k = -6; k < HAFT; k += 5) s.dot(gx + ux * k, gy + uy * k, 1.1, I[2]);
  s.commit();
  const r = 10;
  const cx = head[0] - nx * 4;
  const cy = head[1] - ny * 4;
  const edge: Pt[] = [];
  for (let i = 0; i <= 10; i++) {
    const a = -Math.PI / 2 - 1.15 + (i / 10) * 2.3;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    edge.push([cx + (ux * sa - nx * ca) * -r, cy + (uy * sa - ny * ca) * -r]);
  }
  s.begin();
  s.poly([[head[0] + ux * 3, head[1] + uy * 3], ...edge, [head[0] - ux * 3, head[1] - uy * 3]], I[2]);
  s.shadeEdges(I[2], I[4], I[0], 2);
  s.commit();
  s.begin();
  for (let i = 0; i < edge.length - 1; i++)
    s.hairline(edge[i][0], edge[i][1], edge[i + 1][0], edge[i + 1][1], p.hot > 0.6 ? ECLIPSE[5] : ECLIPSE[3]);
  const mx = (cx + head[0]) / 2 - nx * 2;
  const my = (cy + head[1]) / 2 - ny * 2;
  s.dot(mx, my, 3.4, p.hot > 0.6 ? ECLIPSE[4] : ECLIPSE[2]);
  s.dot(mx + Math.sin(time) * 0.4, my, 2.5, AC.bodyDeep);
  s.set(mx - 2.6, my - 1.4, ECLIPSE[5]);
  s.commit(false);
}

function torso(s: SpriteCanvas, p: HeadsmanPose, H: Hide, time: number): void {
  const l = p.lean;
  s.begin();
  s.poly(
    [
      [-8 + l * 0.4, -26],
      [8 + l * 0.4, -26],
      [10, -10],
      [4, -12],
      [0, -8],
      [-4, -12],
      [-10, -10],
    ],
    T[1],
  );
  s.shadeEdges(T[1], T[2], T[0], 2);
  s.hairline(l * 0.4, -25, 0, -10, T[0]);
  s.commit();
  s.begin();
  s.poly(
    [
      [-12 + l, -47],
      [11 + l, -47],
      [14 + l, -41],
      [10 + l * 0.8, -31],
      [7 + l * 0.5, -24],
      [-7 + l * 0.5, -24],
      [-10 + l * 0.8, -31],
      [-14 + l, -41],
    ],
    H.body,
  );
  s.shadeEdges(H.body, H.sheen, H.dark, 3);
  s.hairline(-8 + l, -37, -1 + l, -36, H.dark);
  s.hairline(2 + l, -36, 9 + l, -37, H.dark);
  s.hairline(l * 0.8, -36, l * 0.6, -26, H.dark);
  s.hairline(-5 + l * 0.7, -30, 5 + l * 0.7, -30, H.dark);
  s.commit();
  s.begin();
  const pulse = Math.sin(time * 3) > 0 ? VOID[3] : VOID[2];
  s.hairline(-3 + l, -44, 1 + l, -38, p.hot > 0.5 ? VOID[5] : pulse);
  s.hairline(1 + l, -38, -1 + l, -31, p.hot > 0.5 ? VOID[4] : VOID[2]);
  s.hairline(1 + l, -38, 6 + l, -34, VOID[2]);
  s.commit(false);
  s.begin();
  for (let i = 0; i <= 10; i++) {
    const u = i / 10;
    s.dot(-12 + l + u * 22, -46 + u * 20, 0.9, i % 2 ? I[3] : I[4]);
  }
  s.commit();
  s.begin();
  s.poly(
    [
      [-7 + l, -48],
      [8 + l, -48],
      [9 + l, -45],
      [-8 + l, -45],
    ],
    I[2],
  );
  s.shadeEdges(I[2], I[4], I[0]);
  s.commit();
}

function pauldron(s: SpriteCanvas, p: HeadsmanPose): void {
  const l = p.lean;
  s.begin();
  s.dot(9 + l, -44, 5.5, I[2]);
  s.shadeEdges(I[2], I[4], I[0], 2);
  s.hairline(5 + l, -42, 13 + l, -42, I[1]);
  fang(s, [8 + l, -48.5], [6 + l, -56], 2.2, CITADEL_FOE.bone[1]);
  fang(s, [11.5 + l, -47.5], [13 + l, -54], 1.8, CITADEL_FOE.bone[1]);
  s.shadeEdges(CITADEL_FOE.bone[1], CITADEL_FOE.bone[2], CITADEL_FOE.bone[0]);
  s.commit();
}

function head(s: SpriteCanvas, p: HeadsmanPose): void {
  const hx = 2 + p.lean * 1.2;
  const hy = -52;
  s.begin();
  s.poly(
    [
      [hx - 7, hy + 5],
      [hx - 6, hy - 4],
      [hx - 1, hy - 9],
      [hx + 5, hy - 7],
      [hx + 7, hy - 1],
      [hx + 6, hy + 5],
    ],
    T[2],
  );
  s.shadeEdges(T[2], T[3], T[0], 2);
  s.commit();
  s.begin();
  s.poly(
    [
      [hx - 1, hy - 4],
      [hx + 5.5, hy - 4],
      [hx + 6, hy + 3],
      [hx + 1.5, hy + 5],
      [hx - 1.5, hy + 2],
    ],
    I[3],
  );
  s.shadeEdges(I[3], I[5], I[1]);
  s.hairline(hx + 0.5, hy - 1.5, hx + 5.5, hy - 1.5, AC.outline);
  s.hairline(hx + 2.5, hy - 1, hx + 2.5, hy + 4, I[1]);
  s.commit();
  const hot = p.hot > 0.5;
  glowEye(s, hx + 4.5, hy - 1.5, hot ? AC.eyeHot : AC.eye, hot ? AC.eye : AC.eyeDim, AC.eyeHot);
  glowEye(s, hx + 1.5, hy - 1.5, hot ? AC.eye : AC.eyeDim, AC.eyeDim, AC.eye);
}

function arm(s: SpriteCanvas, from: Pt, hand: Pt, tone: number, light: number, H: Hide): void {
  const elbow: Pt = [(from[0] + hand[0]) / 2 - 2, (from[1] + hand[1]) / 2 + 3];
  s.begin();
  s.taper(from[0], from[1], elbow[0], elbow[1], 3.4, 2.8, tone);
  s.taper(elbow[0], elbow[1], hand[0], hand[1], 2.8, 2.6, tone);
  s.shadeEdges(tone, light, H.deep, 2);
  s.commit();
  s.begin();
  s.dot(hand[0], hand[1], 2.6, I[2]);
  s.shadeEdges(I[2], I[4], I[0]);
  s.commit();
}

function eclipse(s: SpriteCanvas, p: HeadsmanPose, time: number): void {
  if (p.eclipse <= 0) return;
  const r = 9 * p.eclipse;
  const cx = 4;
  const cy = -74;
  s.begin();
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + time * 1.2;
    const len = r + 3 + (i % 2) * 3;
    s.hairline(
      cx + Math.cos(a) * r,
      cy + Math.sin(a) * r,
      cx + Math.cos(a) * len,
      cy + Math.sin(a) * len,
      ECLIPSE[i % 2 ? 3 : 4],
    );
  }
  s.dot(cx, cy, r + 1, ECLIPSE[4]);
  s.dot(cx + 0.8, cy - 0.3, r - 0.5, AC.bodyDeep);
  s.commit(false);
}

export function drawVoidheadsman(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = headsmanPose(e, time);
  const H = HIDE;
  const sink = Math.max(p.fade, p.rise) * 60;
  const stride = p.stride * 4;
  s.clear();
  s.shift(0, p.bob + sink);
  leg(s, [-4, -14], [-5 - stride, 0], false, H);
  arm(s, [-10 + p.lean, -43], p.grip, H.deep, H.dark, H);
  axe(s, p, time);
  torso(s, p, H, time);
  leg(s, [4, -14], [6 + stride, 0], true, H);
  head(s, p);
  arm(s, [9 + p.lean, -42], [p.grip[0] + 4, p.grip[1] + 3], H.dark, H.sheen, H);
  pauldron(s, p);
  s.shift(0, sink);
  eclipse(s, p, time);
  s.shift(0, 0);
  sunRim(s, AC.rim, AC.rimSoft, 0.35);
  if (sink > 0) clipBelow(s, 0);
  s.outline(AC.outline);
  return s;
}
