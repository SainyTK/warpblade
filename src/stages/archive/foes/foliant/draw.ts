import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Color, Ramp } from "../../../../types/color";
import type { Enemy } from "../../../../types/enemy";
import { mix } from "../../../../utils/color";
import { FOE } from "../colors";
import { type FoliantPose, foliantPose } from "./pose";

const canvas = detailCanvas(76, 76, 38, 68);
const L = FOE.leather;
const P = FOE.paper;
type Pt = readonly [number, number];

const COVERS: readonly Ramp[] = [FOE.leather, FOE.bronze, FOE.ink];

function flatBook(s: SpriteCanvas, x: number, y: number, w: number, cover: Ramp, front: number): void {
  s.begin();
  s.poly(
    [
      [x - w / 2, y - 3],
      [x + w / 2, y - 3],
      [x + w / 2, y],
      [x - w / 2, y],
    ],
    cover[2],
  );
  s.shadeEdges(cover[2], cover[3], cover[0]);
  s.commit();
  s.begin();
  const fx = front > 0 ? x + w / 2 - 1.5 : x - w / 2 + 0.5;
  s.block(fx, y - 2.5, P[3], 1, 2);
  s.hairline(fx, y - 1.5, fx + 1, y - 1.5, P[1]);
  s.hairline(x - w / 2 + 2, y - 2.6, x - w / 2 + 2, y - 0.5, FOE.giltDim);
  s.commit(false);
}

function leg(s: SpriteCanvas, x: number, stride: number, drop: number, near: boolean): void {
  const shift = near ? stride : -stride;
  for (let i = 0; i < 3; i++) {
    const y = -i * 3.5 + Math.min(0, drop * (i / 3));
    const lift = i === 0 && shift > 0.3 ? -shift * 1.2 : 0;
    flatBook(
      s,
      x + shift * (i === 0 ? 2.5 : 1.5 - i * 0.5),
      y + lift,
      8 - i * 0.5,
      COVERS[(i + (near ? 1 : 0)) % 3],
      1,
    );
  }
}

function torso(s: SpriteCanvas, p: FoliantPose, time: number): void {
  const y0 = -40 + p.drop;
  const y1 = -12 + p.drop * 0.5;
  s.begin();
  s.poly(
    [
      [-11, y0 + 1],
      [10, y0],
      [11, y1],
      [-11, y1],
    ],
    P[3],
  );
  s.shadeEdges(P[3], P[4], P[1]);
  for (let y = y0 + 3; y < y1 - 1; y += 2.5) s.hairline(-9, y, 9, y + 0.3, FOE.text);
  s.commit();
  const cover = p.open * 0.85;
  const hinge = -11;
  const span = 22 * (1 - cover);
  s.begin();
  s.poly(
    [
      [hinge, y0],
      [hinge + span, y0 - 0.5 - cover * 3],
      [hinge + span + 0.5, y1 + cover * 2],
      [hinge, y1 + 0.5],
    ],
    L[2],
  );
  s.shadeEdges(L[2], L[3], L[0], 2);
  s.commit();
  if (cover > 0.5) {
    s.begin();
    for (let i = 0; i < 4; i++) {
      const a = time * 7 + i * 1.7;
      const px = -2 + i * 3 + Math.sin(a) * 2;
      const py = y0 + 4 + i * 5 + Math.cos(a) * 1.5;
      s.poly(
        [
          [px, py],
          [px + 3, py - 1 + Math.sin(a) * 1.5],
          [px + 3.5, py + 1.5],
          [px + 0.5, py + 2],
        ],
        P[4],
      );
    }
    s.commit();
    return;
  }
  s.begin();
  for (const [cx, cy] of [
    [-10, y0 + 0.5],
    [hinge + span - 2, y0],
    [-10, y1 - 2],
    [hinge + span - 2, y1 - 2],
  ] as const) {
    s.poly(
      [
        [cx, cy],
        [cx + 2.5, cy],
        [cx + 2.5, cy + 2.5],
      ],
      FOE.gilt,
    );
  }
  const mid = hinge + span * 0.5;
  s.stroke(hinge + 1, y0 + 6, hinge + span - 1, y0 + 6, 0.5, FOE.giltDim);
  s.stroke(hinge + 1, y1 - 5, hinge + span - 1, y1 - 5, 0.5, FOE.giltDim);
  s.commit();
  clasp(s, mid, (y0 + y1) / 2, p.glow);
}

function clasp(s: SpriteCanvas, x: number, y: number, heat: number): void {
  s.begin();
  s.poly(
    [
      [x - 3, y - 4],
      [x + 3, y - 4],
      [x + 3.5, y + 3],
      [x, y + 5],
      [x - 3.5, y + 3],
    ],
    FOE.bronze[3],
  );
  s.shadeEdges(FOE.bronze[3], FOE.bronzeLit, FOE.bronze[1]);
  s.commit();
  s.begin();
  const hot: Color = heat > 0 ? mix(FOE.eye, FOE.glyph[3], heat) : FOE.eye;
  s.dot(x, y - 0.5, 1.3, FOE.ink[0]);
  s.block(x - 0.5, y, FOE.ink[0], 1, 2.5);
  s.set(x, y - 0.5, heat > 0.6 ? FOE.glyph[4] : hot);
  s.set(x - 2, y - 3, FOE.verdigris);
  s.commit(false);
}

function head(s: SpriteCanvas, p: FoliantPose, time: number): void {
  const x = 1;
  const y = -41 + p.drop;
  const flap = Math.sin(time * 3) * 0.6;
  s.begin();
  s.poly(
    [
      [x, y],
      [x - 7, y - 4 - flap],
      [x - 6.5, y - 7 - flap],
      [x, y - 3.5],
    ],
    P[3],
  );
  s.poly(
    [
      [x, y],
      [x + 7, y - 4 + flap],
      [x + 6.5, y - 7 + flap],
      [x, y - 3.5],
    ],
    P[4],
  );
  s.shadeEdges(P[3], P[4], P[1]);
  s.shadeEdges(P[4], FOE.paperGlint, P[2]);
  s.commit();
  s.begin();
  s.poly(
    [
      [x - 1.5, y - 1],
      [x + 1.5, y - 1],
      [x + 0.6, y - 4],
      [x - 0.6, y - 4],
    ],
    FOE.ink[0],
  );
  s.commit();
  s.begin();
  const lit = p.glow > 0.3 ? FOE.eyeHot : FOE.eye;
  s.set(x - 0.5, y - 2.5, lit);
  s.set(x + 1, y - 2.5, lit);
  for (let i = 1; i < 3; i++) {
    s.hairline(x - 1 - i * 2, y - 2.5 - i * 0.7, x - 2 - i * 2, y - 3.3 - i * 0.7, FOE.text);
    s.hairline(x + 1.5 + i * 2, y - 2.5 - i * 0.7, x + 2.5 + i * 2, y - 3.3 - i * 0.7, FOE.text);
  }
  s.commit(false);
}

function arm(s: SpriteCanvas, p: FoliantPose, near: boolean): void {
  const shoulder: Pt = [near ? 8 : -8, -35 + p.drop];
  const fist = near ? p.near : p.far;
  const cover = near ? FOE.leather : FOE.bronze;
  const elbow: Pt = [(shoulder[0] + fist[0]) / 2 + (near ? 2 : -2), (shoulder[1] + fist[1]) / 2 + 1.5];
  s.begin();
  s.taper(shoulder[0], shoulder[1], elbow[0], elbow[1], 3, 2.6, cover[near ? 2 : 1]);
  s.taper(elbow[0], elbow[1], fist[0], fist[1], 2.6, 2.4, cover[near ? 2 : 1]);
  s.shadeEdges(cover[near ? 2 : 1], cover[near ? 3 : 2], cover[0], 2);
  s.commit();
  s.begin();
  s.dot(elbow[0], elbow[1], 1.8, P[near ? 3 : 2]);
  s.commit();
  s.begin();
  s.poly(
    [
      [fist[0] - 4, fist[1] - 4],
      [fist[0] + 4, fist[1] - 4.5],
      [fist[0] + 4.5, fist[1] + 3],
      [fist[0] - 4, fist[1] + 3.5],
    ],
    near ? FOE.ink[3] : FOE.ink[2],
  );
  s.shadeEdges(near ? FOE.ink[3] : FOE.ink[2], near ? FOE.ink[4] : FOE.ink[3], FOE.ink[0], 2);
  s.commit();
  s.begin();
  s.block(fist[0] - 3.5, fist[1] - 3.8, FOE.gilt);
  s.block(fist[0] + 3, fist[1] + 2, FOE.giltDim);
  s.hairline(fist[0] + 3.5, fist[1] - 3.5, fist[0] + 3.5, fist[1] + 2.5, P[3]);
  s.commit(false);
  s.begin();
  flatShoulder(s, shoulder, near);
}

function flatShoulder(s: SpriteCanvas, at: Pt, near: boolean): void {
  s.poly(
    [
      [at[0] - 4.5, at[1] - 3],
      [at[0] + 4.5, at[1] - 3.5],
      [at[0] + 5, at[1] + 0.5],
      [at[0] - 4.5, at[1] + 1],
    ],
    near ? L[2] : L[1],
  );
  s.shadeEdges(near ? L[2] : L[1], near ? L[3] : L[2], L[0]);
  s.hairline(at[0] - 3, at[1] - 1, at[0] + 4, at[1] - 1.3, P[3]);
  s.commit();
}

export function drawFoliant(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = foliantPose(e, time);
  s.clear();
  arm(s, p, false);
  leg(s, -5, p.stride, p.drop, false);
  leg(s, 5, p.stride, p.drop, true);
  torso(s, p, time);
  head(s, p, time);
  arm(s, p, true);
  s.outline(FOE.outline);
  return s;
}
