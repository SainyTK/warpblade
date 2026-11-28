import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { moonlight } from "../../../../game/enemies/night/moonlight";
import type { Enemy } from "../../../../types/enemy";
import { GRAVE } from "../graveColors";
import { type BellPose, bellPose } from "./pose";

type Pt = readonly [number, number];

const canvas = detailCanvas(44, 60, 22, 34);
const Z = GRAVE.brass;
const P = GRAVE.moss;
const B = GRAVE.bone;
const PIVOT: Pt = [0, -12];
const SHELL: readonly Pt[] = [
  [-3.5, -12],
  [3.5, -12],
  [5.6, -9.5],
  [6.2, -4],
  [7.2, 2],
  [9.6, 6.2],
  [9.4, 8],
  [-9.4, 8],
  [-9.6, 6.2],
  [-7.2, 2],
  [-6.2, -4],
  [-5.6, -9.5],
];

const turn =
  (angle: number) =>
  ([x, y]: Pt): Pt => {
    const dx = x - PIVOT[0];
    const dy = y - PIVOT[1];
    return [
      PIVOT[0] + dx * Math.cos(angle) - dy * Math.sin(angle),
      PIVOT[1] + dx * Math.sin(angle) + dy * Math.cos(angle),
    ];
  };

function chains(s: SpriteCanvas, time: number): void {
  s.begin();
  for (const side of [-1, 1]) {
    for (let k = 0; k < 5; k++) {
      const y = -14 - k * 3.2;
      const x = side * (2 + k * 0.9) + Math.sin(time * 1.5 + k) * 0.2;
      if (k % 2 === 0) s.block(x - 0.5, y - 1.5, GRAVE.iron[3], 1, 2.5);
      else s.block(x - 1, y - 1, GRAVE.iron[2], 2, 1.5);
    }
  }
  s.commit(false);
}

function shell(s: SpriteCanvas, p: BellPose, time: number): void {
  const at = turn(p.swing);
  s.begin();
  s.poly(SHELL.map(at), Z[2]);
  s.shadeEdges(Z[2], Z[3], Z[1], 2);
  s.commit();
  s.begin();
  const band = [at([-7.4, 3]), at([7.4, 3])];
  s.hairline(band[0][0], band[0][1], band[1][0], band[1][1], Z[3]);
  const low = [at([-9, 6.4]), at([9, 6.4])];
  s.hairline(low[0][0], low[0][1], low[1][0], low[1][1], Z[1]);
  for (const [x, y] of [
    [-4.5, -6],
    [-5.6, 0],
    [-8.4, 7],
    [3.8, 6.8],
  ] as const) {
    const [px, py] = at([x, y]);
    s.set(px, py, P[2]);
    s.set(px + 0.5, py + 0.5, P[1]);
  }
  const crack = [at([2, -9]), at([3.4, -4]), at([2.4, 0]), at([4, 5])];
  const lit = p.dull ? GRAVE.ghost[0] : p.glow > 0.5 ? GRAVE.moon[4] : GRAVE.moon[2];
  for (let i = 0; i + 1 < crack.length; i++)
    s.hairline(crack[i][0], crack[i][1], crack[i + 1][0], crack[i + 1][1], lit);
  const [gx, gy] = at([-3, -9]);
  s.set(gx, gy, Z[4]);
  s.set(gx + 0.5, gy, Z[4]);
  s.commit(false);
  s.begin();
  const [cx, cy] = at([0, -13.4]);
  s.dot(cx, cy, 2, Z[2]);
  s.shadeEdges(Z[2], Z[3], Z[1]);
  s.commit();
  const swing = Math.sin(time * 6) * p.swing * 4;
  const [kx, ky] = at([-swing, 9.8]);
  s.begin();
  s.dot(kx, ky, 2.2, B[3]);
  s.shadeEdges(B[3], B[4], B[1]);
  s.block(kx - 1.2, ky - 0.4, GRAVE.hollow, 0.9, 0.9);
  s.block(kx + 0.4, ky - 0.4, GRAVE.hollow, 0.9, 0.9);
  if (!p.dull) s.set(kx + 0.6, ky - 0.2, p.glow > 0.5 ? GRAVE.moon[4] : GRAVE.ghost[1]);
  s.hairline(kx - 0.8, ky + 1.2, kx + 0.8, ky + 1.2, B[1]);
  s.commit();
}

export function drawTollbell(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = bellPose(e, time);
  s.clear();
  chains(s, time);
  shell(s, p, time);
  moonlight(s, true);
  s.outline(GRAVE.outline);
  return s;
}
