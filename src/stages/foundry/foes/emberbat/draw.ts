import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { clamp } from "../../../../utils/math";
import { FORGE } from "../../colors";
import { BAT_TIMES } from "./behavior";

type Pt = readonly [number, number];
const canvas = detailCanvas(48, 36, 24, 18);
const L = FORGE.leather;
const C = FORGE.crust;
const M = FORGE.molten;
const MEMBRANE: readonly Pt[] = [
  [0, -1.6],
  [4, -4.2],
  [8, -6],
  [12.5, -4.4],
  [11.4, -1.2],
  [9.6, 0.6],
  [8.2, -0.4],
  [6.6, 1.8],
  [4.6, 0.6],
  [2.6, 2.4],
  [0, 1.8],
];
const BONES: readonly Pt[] = [
  [12.5, -4.4],
  [9.6, 0.6],
  [6.6, 1.8],
  [2.6, 2.4],
];
const ELBOW: Pt = [7.6, -5.4];

interface Pose {
  flap: number;
  sweep: number;
  heat: number;
}

function poseOf(e: Enemy, time: number): Pose {
  if (e.state === "wind") {
    const u = clamp(e.st / BAT_TIMES.wind);
    return { flap: -0.9 + Math.sin(time * 30) * 0.08, sweep: 0, heat: u };
  }
  if (e.state === "dive") return { flap: -0.2, sweep: 0.55, heat: 0.7 };
  if (e.state === "recover") return { flap: Math.sin(time * 8) * 0.6, sweep: 0.1, heat: 0 };
  return { flap: Math.sin(time * 13) * 0.75, sweep: 0, heat: 0 };
}

const toWing = (side: number, angle: number, sweep: number, [u, v]: Pt): Pt => {
  const x = u * Math.cos(angle) - v * Math.sin(angle);
  const y = u * Math.sin(angle) + v * Math.cos(angle);
  return [side * (x * (1 - sweep * 0.45)) - sweep * u * 0.35, y - 1 + sweep * u * 0.2];
};

function wing(s: SpriteCanvas, side: number, p: Pose, near: boolean): void {
  const at = (q: Pt): Pt => toWing(side, p.flap, p.sweep, q);
  const skin = near ? L[1] : L[0];
  s.begin();
  s.poly(MEMBRANE.map(at), skin);
  s.shadeEdges(skin, near ? L[2] : L[1], FORGE.soot);
  s.commit();
  const vein: Color = p.heat > 0.5 ? M[4] : near ? FORGE.wingVein : M[1];
  s.begin();
  const [ex, ey] = at(ELBOW);
  const [rx, ry] = at([0, -1.2]);
  const [tx, ty] = at(MEMBRANE[3]);
  s.hairline(rx, ry, ex, ey, near ? C[3] : C[2]);
  s.hairline(ex, ey, tx, ty, near ? C[3] : C[2]);
  for (const bone of BONES.slice(1)) {
    const [bx, by] = at(bone);
    s.hairline(ex, ey, bx, by, vein);
  }
  for (let i = 1; i < MEMBRANE.length - 1; i++) {
    if (i === 3) continue;
    const [mx, my] = at(MEMBRANE[i]);
    if (i > 3 && i % 2 === 0) s.set(mx, my, near ? M[2] : M[1]);
  }
  s.set(tx, ty, p.heat > 0.5 ? M[4] : near ? FORGE.ironGlint : C[3]);
  const [hx, hy] = at([1.5, -2.2]);
  s.set(hx, hy, near ? C[3] : C[2]);
  s.commit(false);
}

function body(s: SpriteCanvas, p: Pose, time: number): void {
  s.begin();
  s.dot(0, 0.6, 3.7, C[1]);
  s.dot(0.8, -0.6, 2.7, C[2]);
  s.shadeEdges(C[1], C[2], FORGE.soot, 2);
  s.commit();
  s.begin();
  const hot = p.heat > 0.4 ? M[4] : M[2];
  s.hairline(-2, -0.8, -0.6, 1.2, hot);
  s.hairline(-0.6, 1.2, 1, 3, M[2]);
  s.hairline(1, 3, 0.6, 3.8, M[1]);
  s.set(1.8, 0.6, M[3]);
  s.set(-1.6, 2.4, Math.sin(time * 5) > 0 ? M[3] : M[1]);
  s.set(-0.8, 0.6, M[4]);
  s.commit(false);
  s.begin();
  s.poly(
    [
      [-1.8, 3.4],
      [-0.8, 5.4],
      [0.2, 3.6],
    ],
    C[2],
  );
  s.poly(
    [
      [0.8, 3.4],
      [1.8, 5.2],
      [2.6, 3.2],
    ],
    C[2],
  );
  s.shadeEdges(C[2], C[3], C[0]);
  s.commit();
}

function head(s: SpriteCanvas, p: Pose): void {
  s.begin();
  s.dot(3, -3.4, 2.7, C[2]);
  s.poly(
    [
      [1, -4.6],
      [0.8, -9.4],
      [2.9, -5.4],
    ],
    C[2],
  );
  s.poly(
    [
      [3.2, -5.4],
      [5.6, -9],
      [5.2, -4.2],
    ],
    C[2],
  );
  s.poly(
    [
      [4.6, -4],
      [7.2, -2.8],
      [4.8, -1.4],
    ],
    C[2],
  );
  s.shadeEdges(C[2], C[3], C[0]);
  s.commit();
  s.begin();
  s.hairline(1.2, -8.4, 1.8, -5.6, M[1]);
  s.hairline(5.2, -8, 4.8, -5.4, M[1]);
  const eye = p.heat > 0.5 ? WHITE : FORGE.eye;
  s.block(4, -4.4, M[3], 1.2, 1);
  s.set(4.2, -4.4, eye);
  s.set(4.6, -4.4, eye);
  s.block(2, -4.2, M[2], 1, 0.8);
  s.set(2.2, -4.2, eye);
  s.hairline(4.8, -2.2, 6.6, -2.6, C[0]);
  s.set(5.2, -1.8, WHITE);
  s.set(6, -2, WHITE);
  s.commit(false);
}

export function drawEmberbat(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = poseOf(e, time);
  s.clear();
  wing(s, -1, p, false);
  body(s, p, time);
  wing(s, 1, p, true);
  head(s, p);
  s.outline(FORGE.outline);
  return s;
}
