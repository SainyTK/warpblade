import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { FOE } from "../colors";

const canvas = detailCanvas(60, 40, 30, 36);
const F = FOE.frost;
const C = FOE.crystal;

type Pt = readonly [number, number];

const MANE: readonly (readonly [number, number, number])[] = [
  [3, -13, 4],
  [5, -14, 5],
  [7, -15, 4.5],
  [0, -12.5, 3.5],
  [-3, -12.2, 3],
];

interface Pose {
  body: number;
  stretch: number;
  head: number;
  mane: number;
  lean: number;
  front: readonly [Pt, Pt];
  hind: readonly [Pt, Pt];
  tail: Pt;
}

function poseOf(e: Enemy, time: number): Pose {
  if (e.state === "wind") {
    const quiver = Math.sin(time * 50) * 0.3;
    return {
      body: 3,
      stretch: -1,
      head: 4,
      mane: 1.6,
      lean: 0,
      front: [
        [10, -1],
        [7.5, 0],
      ],
      hind: [
        [-11, 0],
        [-8.5, 0],
      ],
      tail: [-17, -13 + quiver],
    };
  }
  if (e.state === "lunge") {
    const f = Math.floor(time * 16) % 2;
    return {
      body: -1,
      stretch: 3,
      head: 1,
      mane: 0.4,
      lean: 0,
      front: f
        ? [
            [17, -3],
            [15, -1],
          ]
        : [
            [12, 0],
            [9, -2],
          ],
      hind: f
        ? [
            [-17, -1],
            [-14, -3],
          ]
        : [
            [-12, 0],
            [-10, -1],
          ],
      tail: [-21, -10],
    };
  }
  if (e.state === "recover") {
    return {
      body: 1,
      stretch: 0,
      head: -1,
      mane: 1,
      lean: -1,
      front: [
        [14, 0],
        [12, 0],
      ],
      hind: [
        [-9, 0],
        [-6, 0],
      ],
      tail: [-15, -8],
    };
  }
  const gait = Math.floor(time * 7) % 4;
  const step = [2, 1, -2, -1][gait];
  const lift = gait % 2 ? -1 : 0;
  return {
    body: gait % 2 ? -0.5 : 0,
    stretch: 0,
    head: 0,
    mane: 1,
    lean: 0,
    front: [
      [7 + step, lift],
      [7 - step, 0],
    ],
    hind: [
      [-7 - step, 0],
      [-7 + step, lift],
    ],
    tail: [-16, -14 + Math.sin(time * 8)],
  };
}

function leg(s: SpriteCanvas, hip: Pt, paw: Pt, near: boolean, hind: boolean): void {
  const tone = near ? F[2] : F[0];
  const knee: Pt = hind
    ? [(hip[0] + paw[0]) / 2 + 2, (hip[1] + paw[1]) / 2 - 0.5]
    : [(hip[0] + paw[0]) / 2 - 0.5, (hip[1] + paw[1]) / 2];
  s.begin();
  s.stroke(hip[0], hip[1], knee[0], knee[1], near ? 1.5 : 1.3, tone);
  s.stroke(knee[0], knee[1], paw[0], paw[1] - 0.6, near ? 0.9 : 0.8, tone);
  s.shadeEdges(tone, near ? F[3] : F[1], near ? F[1] : FOE.frostDeep, 1);
  s.commit();
  s.begin();
  s.block(paw[0] - 0.5, paw[1] - 1, near ? F[3] : F[1], 2, 1);
  s.set(paw[0] + 1, paw[1] - 0.5, FOE.outline);
  s.commit();
}

function shard(s: SpriteCanvas, x: number, y: number, len: number, angle: number, hot: boolean): void {
  const dx = Math.cos(angle) * len;
  const dy = Math.sin(angle) * len;
  const nx = -Math.sin(angle) * 0.9;
  const ny = Math.cos(angle) * 0.9;
  s.poly(
    [
      [x - nx, y - ny],
      [x + dx, y + dy],
      [x + nx, y + ny],
    ],
    C[1],
  );
  s.hairline(x - nx * 0.5, y - ny * 0.5, x + dx * 0.85, y + dy * 0.85, hot ? C[4] : C[3]);
  s.set(x + dx, y + dy, C[4]);
}

export function drawRimehound(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = poseOf(e, time);
  const winding = e.state === "wind";
  const dashing = e.state === "lunge";
  const by = p.body;
  const sx = p.stretch;
  s.clear();
  s.begin();
  const [tx, ty] = p.tail;
  s.taper(-11 - sx, -11 + by, tx - sx, ty + by, 1.8, 0.8, F[2], 1.2);
  s.shadeEdges(F[2], F[3], F[1]);
  s.commit();
  s.begin();
  for (let i = 0; i < 3; i++) shard(s, tx - sx + 2 + i * 1.6, ty + by - 0.5 + i * 0.4, 3 + i, -2.6 - i * 0.25, winding);
  s.commit();
  leg(s, [-7 - sx, -7 + by], p.hind[1], false, true);
  leg(s, [6 + sx, -7 + by], p.front[1], false, false);
  s.begin();
  s.dot(-7 - sx, -10 + by, 4.2, F[2]);
  s.dot(-1, -10.5 + by, 4, F[2]);
  s.dot(5 + sx, -10.5 + by, 4.6, F[2]);
  s.stroke(-7 - sx, -9 + by, 5 + sx, -9.5 + by, 3.6, F[2]);
  s.shadeEdges(F[2], F[3], F[1], 2);
  s.stroke(-5, -6.6 + by, 6, -6.4 + by, 0.6, F[1]);
  s.set(-6 - sx, -13.5 + by, F[4]);
  s.set(-1, -14 + by, F[4]);
  s.commit();
  s.begin();
  for (const [x, y, len] of MANE) {
    const angle = dashing ? -2.9 : winding ? -1.9 : -2.35;
    shard(s, x + (x > 2 ? sx : 0), y + by, len * p.mane, angle + x * 0.03, winding);
  }
  s.commit();
  const hx = 11 + sx;
  const hy = -15 + by + p.head;
  s.begin();
  s.stroke(6 + sx, -12 + by, hx - 1, hy + 0.5, 2.4, F[2]);
  s.dot(hx, hy, 2.8, F[3]);
  s.taper(hx + 1, hy + 0.3, hx + 6.5, hy + 1.6 - p.lean, 1.8, 0.9, F[3]);
  s.shadeEdges(F[3], F[4], F[1], 1);
  s.stroke(hx + 1, hy + 2.2, hx + 5.5, hy + 2.6 - p.lean, 0.5, F[1]);
  s.set(hx + 6.5, hy + 1.3 - p.lean, FOE.nose);
  s.set(hx + 6.5, hy + 1.8 - p.lean, FOE.nose);
  s.commit();
  s.begin();
  s.poly(
    [
      [hx - 2.4, hy - 1.6],
      [hx - 2.6 + (winding ? -1.5 : 0), hy - 6.5 + (winding ? 1.2 : 0)],
      [hx + 0.4, hy - 2],
    ],
    F[2],
  );
  s.shadeEdges(F[2], F[4], F[1]);
  s.set(hx - 2, hy - 3.5, C[2]);
  s.commit();
  s.begin();
  s.block(hx + 1, hy - 1, winding || dashing ? FOE.eyeHot : FOE.eye, 1, 0.5);
  s.set(hx + 0.5, hy - 1, C[0]);
  s.commit();
  if (winding || e.state === "recover") {
    s.begin();
    for (let i = 0; i < 3; i++) s.set(hx + 7.5 + i * 0.8, hy + 2 - i * 0.6 + Math.sin(time * 9 + i) * 0.4, C[3]);
    s.commit();
  }
  leg(s, [-6 - sx, -6.5 + by], p.hind[0], true, true);
  leg(s, [7 + sx, -6.5 + by], p.front[0], true, false);
  s.outline(FOE.outline);
  if (dashing) {
    s.begin();
    for (let i = 0; i < 4; i++)
      s.hairline(-15 - i * 2 - sx, -13 + i * 2.6 + by, -21 - i * 3 - sx, -13 + i * 2.6 + by, C[3]);
    s.commit(false);
  }
  return s;
}
