import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { lerp, smooth } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { BLIGHT } from "../../colors";
import { ROLL } from "./rotcrawler";

const canvas = detailCanvas(44, 30, 22, 27);
const S = BLIGHT.shell;
const PLATES = 5;
const BALL = 7;

type Pt = [number, number];

function curlOf(e: Enemy): number {
  if (e.air) return 1;
  if (e.state === "wind") return smooth(0.2, 0.85, e.st / (ROLL.shake * waveScale(game.wave).windup));
  if (e.state === "lunge") return 1;
  if (e.state === "recover") return 1 - smooth(0, ROLL.unroll, e.st);
  return 0;
}

function shellOutline(cx: number, cy: number, rx: number, ry: number, under: number): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i <= 20; i++) {
    const a = Math.PI + (i / 20) * Math.PI;
    pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
  }
  for (let i = 1; i < 20; i++) {
    const a = (i / 20) * Math.PI;
    pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * under]);
  }
  return pts;
}

function legs(s: SpriteCanvas, time: number, walking: boolean, tuck: number, near: boolean): void {
  if (tuck >= 1) return;
  const base = near ? S[2] : S[0];
  s.begin();
  for (let i = 0; i < 3; i++) {
    const hx = -5 + i * 5 + (near ? 0.5 : -0.5);
    const phase = Math.sin(time * 14 + i * 2.1 + (near ? 0 : Math.PI));
    const step = walking ? phase * 1.6 : 0;
    const lift = walking ? Math.max(0, -phase) * 1.2 : 0;
    const fx = hx + 2 + step;
    const kneeX = hx + 3 + step * 0.5;
    const fy = -lift;
    const reach = 1 - tuck;
    s.stroke(hx, -3.5, lerp(hx, kneeX, reach), lerp(-3.5, -3.5 - 1.5, reach), 0.55, base);
    s.stroke(lerp(hx, kneeX, reach), lerp(-3.5, -5, reach), lerp(hx, fx, reach), lerp(-3.5, fy, reach), 0.45, base);
  }
  if (near) s.shadeEdges(base, S[3], S[1]);
  s.commit();
}

function body(s: SpriteCanvas, c: number, spin: number, jitter: number, time: number, hot: boolean): void {
  const cx = lerp(-1, 0, c) + jitter;
  const cy = lerp(-7.2, -BALL, c);
  const rx = lerp(10.5, BALL, c);
  const ry = lerp(6.8, BALL, c);
  const under = lerp(3.2, BALL, c);
  s.begin();
  s.poly(shellOutline(cx, cy, rx, ry, under), S[2]);
  s.shadeEdges(S[2], S[3], S[1], 2);
  s.commit();
  s.begin();
  for (let i = 0; i < PLATES; i++) {
    const a = -Math.PI / 2 + (i - (PLATES - 1) / 2) * lerp(0.62, 1.25, c) + spin;
    const hubY = cy + lerp(ry * 0.9, 0, c);
    const ox = Math.cos(a);
    const oy = Math.sin(a);
    const x1 = cx + ox * rx;
    const y1 = hubY + oy * (lerp(ry * 1.85, ry, c) + 0.2);
    const top = c > 0.5 || y1 < cy + under - 0.6;
    const from = lerp(0.42, 0.3, c);
    if (top) {
      s.hairline(lerp(cx, x1, from), lerp(hubY, y1, from), x1, y1, S[0]);
      s.hairline(lerp(cx, x1, from) + 0.5, lerp(hubY, y1, from), x1 + 0.5, y1, S[4]);
    }
    const gx = lerp(cx, x1, 0.86);
    const gy = lerp(hubY, y1, 0.86);
    if (top && i % 2 === 0) s.set(gx, gy, BLIGHT.spore[3]);
  }
  s.commit(false);
  s.begin();
  const sheenX = cx - rx * 0.35;
  const sheenY = cy - ry * 0.62;
  s.stroke(sheenX - 1.5, sheenY + 0.8, sheenX + 1.6, sheenY - 0.4, 0.45, hot ? BLIGHT.sheenHot : BLIGHT.sheen);
  s.set(sheenX - 1, sheenY, BLIGHT.sheenHot);
  s.commit(false);
  if (c < 0.6) {
    s.begin();
    s.dot(cx - 4.5, cy - ry * 0.82, 1.3, BLIGHT.fungus[2]);
    s.dot(cx - 2.2, cy - ry * 0.95, 0.9, BLIGHT.fungus[3]);
    s.shadeEdges(BLIGHT.fungus[2], BLIGHT.fungus[4], BLIGHT.fungus[1]);
    s.set(cx - 4.8, cy - ry * 0.82 - 0.9, BLIGHT.fungus[4]);
    s.commit();
    s.begin();
    for (let i = 0; i < 4; i++) {
      const mx = cx + 1 + i * 1.6;
      const my = cy - ry * (0.98 - i * 0.12) + 0.3;
      s.set(mx, my, BLIGHT.rot[3 - (i % 2)]);
      s.set(mx + 0.5, my - 0.5, BLIGHT.rot[4]);
    }
    s.commit(false);
  }
  const drip = (time * 0.8) % 1;
  if (c < 0.3 && drip < 0.6) {
    s.begin();
    s.block(cx + rx * 0.4, cy + under * 0.7 + drip * 2.4, BLIGHT.sap[2], 0.5, 1);
    s.commit(false);
  }
}

function head(s: SpriteCanvas, c: number, jitter: number, chomp: number, fierce: boolean): void {
  if (c >= 0.9) return;
  const tuck = c * 6;
  const hx = 9 - tuck + jitter;
  const hy = -4.8 + c * 1.5;
  s.begin();
  s.dot(hx, hy, 2.6, S[1]);
  s.shadeEdges(S[1], S[3], S[0]);
  s.commit();
  s.begin();
  const open = 0.6 + chomp;
  s.taper(hx + 1.5, hy - 0.4, hx + 4.6, hy - open, 0.75, 0.25, BLIGHT.bone[2], -0.6);
  s.taper(hx + 1.5, hy + 0.9, hx + 4.4, hy + 0.9 + open * 0.6, 0.7, 0.25, BLIGHT.bone[1], 0.6);
  s.shadeEdges(BLIGHT.bone[2], BLIGHT.bone[3], BLIGHT.bone[1]);
  s.commit();
  s.begin();
  s.block(hx + 0.5, hy - 1.5, fierce ? BLIGHT.eyeHot : BLIGHT.eye, 1);
  s.set(hx + 0.5, hy - 1.5, BLIGHT.eyeHot);
  s.commit(false);
  s.begin();
  s.hairline(hx - 0.5, hy - 2.2, hx + 2.5, hy - 5.5 - chomp, S[3]);
  s.hairline(hx + 2.5, hy - 5.5 - chomp, hx + 4.5, hy - 5.8 - chomp, S[3]);
  s.commit(false);
}

function smear(s: SpriteCanvas): void {
  s.begin();
  for (let i = 0; i < 3; i++) {
    const y = -3 - i * 3.5;
    s.hairline(-BALL - 2 - i, y, -BALL - 7 + i, y, i === 1 ? BLIGHT.sheen : S[3]);
  }
  s.commit(false);
}

export function drawRotcrawler(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const c = curlOf(e);
  const walking = e.state === "walk" && Math.abs(e.vx) > 4;
  const winding = e.state === "wind";
  const jitter = winding ? Math.sin(time * 55) * 0.5 : 0;
  const spin = e.state === "lunge" ? Math.abs(e.x - e.ax) / BALL : e.state === "recover" ? (1 - c) * 0.4 : 0;
  const lift = e.state === "recover" && c < 0.05 ? Math.abs(Math.sin(time * 9)) * 0.5 : 0;
  s.clear();
  s.shift(0, -lift);
  legs(s, time, walking, c * 1.4, false);
  if (e.state === "lunge") smear(s);
  body(s, c, spin, jitter, time, winding);
  head(
    s,
    c,
    jitter,
    winding ? Math.abs(Math.sin(time * 18)) * 0.8 : walking ? Math.abs(Math.sin(time * 6)) * 0.3 : 0,
    winding,
  );
  legs(s, time, walking, c * 1.4, true);
  s.outline(BLIGHT.outline);
  return s;
}
