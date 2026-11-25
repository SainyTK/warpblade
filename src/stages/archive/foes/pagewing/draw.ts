import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { game } from "../../../../game/state";
import type { Color } from "../../../../types/color";
import type { Enemy } from "../../../../types/enemy";
import { scale } from "../../../../utils/color";
import { clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { FOE } from "../colors";
import { PAGEWING_THROW } from "./behavior";

const canvas = detailCanvas(46, 40, 23, 20);
const P = FOE.paper;
type Pt = [number, number];
const ROOT: Pt = [0, -2];
const WING = { length: 10, width: 5.5 } as const;

function page(
  s: SpriteCanvas,
  root: Pt,
  angle: number,
  length: number,
  width: number,
  dim: number,
  lines: number,
): void {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const nx = -dy;
  const ny = dx;
  const tone = (c: Color) => (dim < 1 ? scale(c, dim) : c);
  const at = (u: number, v: number): Pt => [root[0] + dx * u + nx * v, root[1] + dy * u + ny * v];
  s.begin();
  s.poly([at(0, 0), at(length, -0.6), at(length - 0.8, width), at(0, width * 0.7)], tone(P[3]));
  s.shadeEdges(tone(P[3]), tone(P[4]), tone(P[2]));
  for (let i = 1; i <= lines; i++) {
    const v = (width * 0.75 * i) / (lines + 1);
    const [x0, y0] = at(1.2, v);
    const [x1, y1] = at(length - 1.8 - (i % 2) * 1.5, v - 0.3);
    s.hairline(x0, y0, x1, y1, tone(FOE.text));
  }
  const [tx, ty] = at(length, -0.6);
  s.set(tx, ty, tone(FOE.paperGlint));
  s.commit();
}

function flapOf(e: Enemy, time: number): number {
  if (e.state === "wind") return -0.95;
  if (e.state === "shoot") return 1.15;
  const rate = e.state === "recover" ? 9 : 15;
  return Math.sin(time * rate) * 0.85;
}

function blades(s: SpriteCanvas, k: number): void {
  s.begin();
  for (let i = 0; i < 3; i++) {
    const a = -2.3 + i * 0.32;
    const r = 6 + k * 3;
    const x = Math.cos(a) * r;
    const y = -2 + Math.sin(a) * r;
    s.poly(
      [
        [x - 1.2, y + 0.3],
        [x + Math.cos(a) * 3, y + Math.sin(a) * 3],
        [x + 1.2, y - 0.3],
      ],
      P[4],
    );
    s.set(x + Math.cos(a) * 2.5, y + Math.sin(a) * 2.5, FOE.paperGlint);
  }
  s.commit();
}

export function drawPagewing(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const flap = flapOf(e, time);
  const bob = Math.round(Math.sin(time * 15) * 0.6 * 2) / 2;
  const root: Pt = [ROOT[0], ROOT[1] + bob];
  const wingAngle = -Math.PI / 2 - 0.55 + flap;
  s.clear();
  page(s, [root[0] - 0.5, root[1] - 0.5], wingAngle - 0.35, WING.length - 1, WING.width - 1, 0.62, 2);
  s.begin();
  for (let i = 0; i < 3; i++) {
    const a = Math.PI - 0.35 + i * 0.32 + Math.sin(time * 6 + i) * 0.08;
    const tx = -4 + Math.cos(a) * 7;
    const ty = bob + Math.sin(a) * 7 + 1;
    s.poly(
      [
        [-4, bob - 0.5],
        [tx, ty - 0.8],
        [tx - 0.3, ty + 0.9],
        [-4, bob + 1],
      ],
      i === 1 ? P[3] : P[2],
    );
    s.hairline(-5, bob + 0.2, tx + 1, ty, FOE.paperShade);
  }
  s.commit();
  s.begin();
  s.poly(
    [
      [-5, bob],
      [0, bob - 3.4],
      [6, bob - 1.4],
      [1.5, bob + 3.2],
    ],
    P[3],
  );
  s.shadeEdges(P[3], P[4], P[1], 2);
  s.hairline(-4.5, bob, 5.5, bob - 1.3, P[1]);
  s.commit();
  s.begin();
  s.dot(-0.5, bob + 0.8, 1.4, FOE.ink[2]);
  s.taper(-0.5, bob + 1.5, -1, bob + 4 + Math.sin(time * 3) * 0.5, 0.6, 0.25, FOE.ink[2]);
  s.set(-1, bob + 0.25, FOE.inkSheen);
  s.commit();
  s.begin();
  s.poly(
    [
      [4.5, bob - 3.2],
      [10.5, bob - 1.6],
      [5.5, bob + 0.2],
    ],
    P[4],
  );
  s.shadeEdges(P[4], FOE.paperGlint, P[2]);
  s.hairline(5, bob - 1.6, 10, bob - 1.6, P[2]);
  s.commit();
  s.begin();
  const hot = e.state === "wind" || e.state === "shoot";
  s.dot(6, bob - 2, 0.9, FOE.ink[0]);
  s.set(6, bob - 2.5, hot ? FOE.eyeHot : FOE.eye);
  if (hot) s.set(6.5, bob - 2, FOE.eye);
  s.commit(false);
  if (e.state === "wind") blades(s, clamp(e.st / (PAGEWING_THROW.wind * waveScale(game.wave).windup)));
  page(s, root, wingAngle, WING.length, WING.width, 1, 3);
  s.outline(FOE.outline);
  return s;
}
