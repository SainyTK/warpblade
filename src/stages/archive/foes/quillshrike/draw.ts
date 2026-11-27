import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { FOE } from "../colors";
import { type QuillshrikePose, quillshrikePose } from "./pose";

const canvas = detailCanvas(60, 60, 30, 30);
const I = FOE.ink;
const S = FOE.steel;
type Pt = [number, number];
type Frame = (u: number, v: number) => Pt;

const TAIL = -16;
const COLLAR = 4;
const NIB = 12;

function frameOf(p: QuillshrikePose): Frame {
  const a = p.pitch + p.shiver;
  const c = Math.cos(a);
  const n = Math.sin(a);
  return (u, v) => [u * c - v * n, u * n + v * c];
}

function width(u: number): number {
  const k = (u - TAIL) / (COLLAR - TAIL);
  return 4.6 * Math.sin(Math.PI * Math.min(1, k * 0.92)) ** 0.6;
}

function plume(s: SpriteCanvas, at: Frame, p: QuillshrikePose, far: boolean): void {
  const spread = far ? -2.4 + p.flap * 0.5 : -2.75 + p.flap * 0.7;
  const tone = far ? I[1] : I[2];
  const [rx, ry] = at(-1, far ? -1 : 0.5);
  const len = far ? 9 : 11;
  const tip: Pt = [
    rx + Math.cos(spread + (p.pitch + p.shiver)) * len,
    ry + Math.sin(spread + (p.pitch + p.shiver)) * len,
  ];
  s.begin();
  s.taper(rx, ry, tip[0], tip[1], 2, 0.6, tone, far ? 1 : -1.2);
  s.shadeEdges(tone, far ? I[2] : I[4], I[0]);
  s.commit();
  if (far) return;
  s.begin();
  s.hairline(rx, ry, (rx + tip[0]) / 2, (ry + tip[1]) / 2, FOE.paper[2]);
  s.commit(false);
}

function vane(s: SpriteCanvas, at: Frame, time: number): void {
  const top: Pt[] = [];
  const bottom: Pt[] = [];
  for (let u = TAIL; u <= COLLAR; u += 1.5) {
    const w = width(u);
    const ripple = Math.sin(u * 0.9 + time * 6) * 0.35;
    top.push(at(u, -w - ripple));
    bottom.push(at(u, w * 0.8 + ripple));
  }
  s.begin();
  s.poly([...top, ...bottom.reverse()], I[2]);
  s.shadeEdges(I[2], I[3], I[0], 2);
  for (let u = TAIL + 2; u < COLLAR - 1; u += 2.2) {
    const w = width(u);
    s.hairline(...at(u, -0.4), ...at(u - 2.2, -w * 0.9), I[1]);
    s.hairline(...at(u, 0.4), ...at(u - 2, w * 0.7), I[1]);
  }
  s.commit();
  s.begin();
  for (let u = TAIL + 3; u < COLLAR - 2; u += 4.4) s.set(...at(u - 1, -width(u) * 0.55), FOE.inkSheen);
  s.hairline(...at(TAIL - 1.5, 0), ...at(COLLAR, 0), FOE.paper[3]);
  s.set(...at(COLLAR - 3, 0), FOE.paper[4]);
  const drip = 1.5 + Math.sin(time * 3) * 0.7;
  s.taper(...at(TAIL + 0.5, 1), ...at(TAIL - 0.5, 1.5 + drip), 0.6, 0.3, I[2]);
  s.commit(false);
}

function nib(s: SpriteCanvas, at: Frame, p: QuillshrikePose): void {
  s.begin();
  s.poly([at(COLLAR, -1.8), at(COLLAR + 1.8, -1.9), at(COLLAR + 1.8, 1.9), at(COLLAR, 1.8)], FOE.gilt);
  s.set(...at(COLLAR + 0.5, -1.2), FOE.glyph[4]);
  s.commit();
  s.begin();
  s.poly([at(COLLAR + 1.8, -1.7), at(NIB - 2, -0.9), at(NIB, 0), at(NIB - 2, 0.9), at(COLLAR + 1.8, 1.6)], S[2]);
  s.shadeEdges(S[2], S[3], S[0]);
  s.commit();
  s.begin();
  s.hairline(...at(COLLAR + 5, 0), ...at(NIB - 0.5, 0), I[0]);
  const [ex, ey] = at(COLLAR + 4, 0);
  s.dot(ex, ey, 1.05, I[0]);
  s.set(ex, ey, p.glare > 0.3 ? FOE.eyeHot : FOE.eye);
  if (p.glare > 0.3) s.set(...at(COLLAR + 4.5, -0.5), FOE.eye);
  if (p.glare > 0.5) {
    const [tx, ty] = at(NIB + 0.8, 0);
    s.dot(tx, ty, 0.6 + p.glare * 0.4, FOE.letter);
    s.set(tx, ty, FOE.letterHot);
  }
  s.commit(false);
}

export function drawQuillshrike(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = quillshrikePose(e, time);
  const at = frameOf(p);
  s.clear();
  plume(s, at, p, true);
  vane(s, at, time);
  nib(s, at, p);
  plume(s, at, p, false);
  s.outline(FOE.outline);
  return s;
}
