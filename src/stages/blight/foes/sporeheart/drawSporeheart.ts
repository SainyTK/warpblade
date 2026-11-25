import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { mix, WHITE } from "../../../../utils/color";
import { grain } from "../../../../utils/grain";
import { lerp } from "../../../../utils/math";
import { BLIGHT } from "../../colors";
import { type ArmPose, type HeartPose, heartPose, type Pt } from "./heartPose";
import { windTime } from "./sporeheart";

const canvas = detailCanvas(124, 104, 62, 98);
const B = BLIGHT.bark;
const F = BLIGHT.flesh;
const V = BLIGHT.vein;
const HEART = { x: 1, y: -34, r: 11.5 } as const;

const THRONE: readonly (readonly [Pt, Pt, Pt, number, number])[] = [
  [[-30, 0], [-34, -40], [-12, -72], 4.2, 1.6],
  [[28, 0], [33, -40], [10, -73], 4, 1.5],
  [[-18, 0], [-24, -30], [-4, -64], 2.6, 1],
  [[16, 0], [22, -34], [3, -66], 2.5, 1],
  [[-38, 0], [-40, -14], [-30, -26], 2.4, 0.8],
  [[38, 0], [41, -16], [33, -28], 2.2, 0.8],
];

const BASE: readonly (readonly [number, number, number])[] = [
  [-44, 0.5, 1.6],
  [-34, -1, 2.8],
  [-22, -2, 3.6],
  [-10, -3, 4.4],
  [2, -3, 4.6],
  [14, -2.5, 4],
  [26, -1.5, 3.2],
  [38, -0.5, 2.4],
  [46, 0.5, 1.4],
];

function quad(a: Pt, m: Pt, b: Pt, u: number): Pt {
  return [
    (1 - u) ** 2 * a[0] + 2 * (1 - u) * u * m[0] + u * u * b[0],
    (1 - u) ** 2 * a[1] + 2 * (1 - u) * u * m[1] + u * u * b[1],
  ];
}

function throne(s: SpriteCanvas, glow: number): void {
  s.begin();
  for (const [a, m, b, r0, r1] of THRONE) {
    const n = 14;
    for (let i = 0; i < n; i++) {
      const p = quad(a, m, b, i / n);
      const q = quad(a, m, b, (i + 1) / n);
      s.stroke(p[0], p[1], q[0], q[1], lerp(r0, r1, i / n), B[2]);
    }
  }
  s.shadeEdges(B[2], B[3], B[1], 2);
  for (const [a, m, b] of THRONE)
    for (let i = 2; i < 12; i += 3) {
      const p = quad(a, m, b, i / 14);
      s.hairline(p[0] - 1, p[1] - 0.5, p[0] + 0.8, p[1] + 1, B[1]);
      s.set(p[0] + 1.2, p[1] - 1, B[4]);
    }
  s.commit();
  s.begin();
  s.dot(-1, -74, 2.4, B[3]);
  s.taper(-1, -74, -5, -84, 1.6, 0.4, B[3], 1);
  s.taper(0, -74, 5, -83, 1.4, 0.4, B[3], -1);
  s.taper(-2, -74, -1, -88, 1.2, 0.3, B[3], 0.5);
  s.shadeEdges(B[3], B[4], B[1]);
  s.commit();
  s.begin();
  const shelves: readonly Pt[] = [
    [-33, -38],
    [-30, -50],
    [33, -30],
    [30, -44],
    [-22, -18],
  ];
  shelves.forEach(([x, y], i) => {
    const w = i % 2 ? 4 : 5;
    const dir = x < 0 ? -1 : 1;
    s.poly(
      [
        [x - dir * 1, y + 1],
        [x + dir * w, y - 0.5],
        [x + dir * (w + 1), y + 1],
        [x - dir * 1, y + 2],
      ],
      BLIGHT.fungus[2],
    );
  });
  s.shadeEdges(BLIGHT.fungus[2], BLIGHT.fungus[3 + (glow > 0.5 ? 1 : 0)], BLIGHT.fungus[1]);
  for (const [x, y] of shelves) {
    s.set(x + (x < 0 ? -2 : 2), y + 1.5, BLIGHT.fungus[4]);
  }
  s.commit();
}

function rootBase(s: SpriteCanvas): void {
  s.begin();
  for (const [x, y, r] of BASE) s.dot(x, y, r, B[2]);
  for (let i = 0; i < BASE.length - 1; i++) {
    const [x0, y0, r0] = BASE[i];
    const [x1, y1, r1] = BASE[i + 1];
    s.stroke(x0, y0, x1, y1, Math.min(r0, r1), B[2]);
  }
  s.shadeEdges(B[2], B[3], B[1], 2);
  for (let x = -40; x <= 42; x += 3) {
    const y = -1 - grain(x, 5) * 3;
    s.hairline(x, y, x + 1.5, y + 1.5, B[1]);
  }
  s.commit();
  s.begin();
  s.dot(-24, -5, 2.6, BLIGHT.bone[2]);
  s.dot(-22.5, -3.6, 1.8, BLIGHT.bone[2]);
  s.shadeEdges(BLIGHT.bone[2], BLIGHT.bone[3], BLIGHT.bone[1]);
  s.block(-25, -5.5, BLIGHT.outline, 1, 1);
  s.block(-22.5, -5, BLIGHT.outline, 1, 1);
  s.set(-23.5, -3, BLIGHT.outline);
  s.commit();
  s.begin();
  for (let i = 0; i < 4; i++) {
    const x = 18 + i * 2.6;
    s.taper(x, -1, x + 1.5, -7 + i * 0.4, 0.55, 0.3, BLIGHT.bone[2], -0.8);
  }
  s.shadeEdges(BLIGHT.bone[2], BLIGHT.bone[3], BLIGHT.bone[1]);
  s.commit();
}

function arteries(s: SpriteCanvas, p: HeartPose): void {
  s.begin();
  const lift = p.beat * 0.4;
  s.taper(HEART.x - 6, HEART.y + 8, -20, -2, 2.2, 1.4, F[2], -2);
  s.taper(HEART.x + 6, HEART.y + 8, 18, -2, 2.2, 1.4, F[2], 2);
  s.taper(HEART.x - 9, HEART.y - 4 - lift, -26, -46, 1.8, 1, F[2], 1.5);
  s.taper(HEART.x + 9, HEART.y - 5 - lift, 24, -50, 1.8, 1, F[2], -1.5);
  s.shadeEdges(F[2], F[3], F[1]);
  s.commit();
}

function heart(s: SpriteCanvas, p: HeartPose, time: number): void {
  const swell = p.beat * 0.9;
  const { x, y, r } = HEART;
  s.begin();
  s.dot(x, y, r + swell, F[2]);
  s.dot(x - 5, y - 8, 7 + swell * 0.6, F[2]);
  s.dot(x + 5.5, y - 8.5, 7.4 + swell * 0.6, F[2]);
  s.dot(x + 1, y + 9, 6 + swell * 0.4, F[2]);
  s.shadeEdges(F[2], F[3], F[1], 3);
  s.dot(x - 4, y - 10, 3.4, F[3]);
  s.dot(x + 6, y - 11, 2.6, F[3]);
  s.shadeEdges(F[3], F[4], F[3]);
  s.commit();
  s.begin();
  const veins: readonly (readonly [Pt, Pt, Pt])[] = [
    [
      [x - 8, y - 6],
      [x - 4, y],
      [x - 6, y + 8],
    ],
    [
      [x + 2, y - 14],
      [x + 5, y - 6],
      [x + 9, y - 2],
    ],
    [
      [x - 2, y - 4],
      [x + 1, y + 3],
      [x + 3, y + 12],
    ],
    [
      [x - 10, y + 2],
      [x - 6, y + 4],
      [x - 3, y + 8],
    ],
  ];
  const hot = mix(V[1], V[3], p.beat * 0.6 + (p.core > 0 ? 0.3 : 0));
  for (const [a, m, b] of veins) {
    for (let i = 0; i < 6; i++) {
      const q0 = quad(a, m, b, i / 6);
      const q1 = quad(a, m, b, (i + 1) / 6);
      s.hairline(q0[0], q0[1], q1[0], q1[1], i < 3 ? hot : V[1]);
    }
  }
  s.commit(false);
  s.begin();
  const sacs: readonly Pt[] = [
    [x - 7, y - 15],
    [x - 1, y - 18],
    [x + 6, y - 16],
    [x + 10, y - 12],
  ];
  sacs.forEach(([sx, sy], i) => {
    const r0 = 1.8 + (i % 2) * 0.6 + p.sacs * 1.6 + Math.sin(time * 3 + i) * 0.2;
    s.dot(sx, sy - p.sacs * 1.2, r0, BLIGHT.spore[1]);
  });
  s.shadeEdges(BLIGHT.spore[1], BLIGHT.spore[3], BLIGHT.spore[0]);
  sacs.forEach(([sx, sy]) => {
    s.set(sx - 0.5, sy - 0.8 - p.sacs * 1.2, p.sacs > 0.5 ? WHITE : BLIGHT.spore[4]);
  });
  s.commit();
}

function core(s: SpriteCanvas, p: HeartPose, time: number): void {
  if (p.open <= 0) return;
  const { x, y } = HEART;
  const w = 5.2 * p.open;
  const top = y - 13;
  const bottom = y + 11;
  const lens = (inset: number): Pt[] => {
    const pts: Pt[] = [];
    for (let i = 0; i <= 10; i++) {
      const u = i / 10;
      pts.push([
        x + Math.sin(u * Math.PI) * (w - inset) + Math.sin(u * 9 + time) * 0.3,
        lerp(top + inset, bottom - inset, u),
      ]);
    }
    for (let i = 10; i >= 0; i--) {
      const u = i / 10;
      pts.push([x - Math.sin(u * Math.PI) * (w - inset), lerp(top + inset, bottom - inset, u)]);
    }
    return pts;
  };
  s.begin();
  s.poly(lens(-1.4), F[1]);
  s.commit(false);
  s.begin();
  s.poly(lens(0), BLIGHT.spore[2]);
  if (w > 2) s.poly(lens(1.4), BLIGHT.spore[3]);
  if (w > 3) s.poly(lens(2.8), p.core > 0.8 ? WHITE : BLIGHT.spore[4]);
  s.commit(false);
  s.begin();
  for (let i = 0; i < 4; i++) {
    const yy = lerp(top + 4, bottom - 4, i / 3) + Math.sin(time * 2 + i) * 0.5;
    s.hairline(x - w * 0.8, yy, x + w * 0.8, yy + (i % 2 ? 1 : -1), F[2]);
  }
  for (let i = 0; i < 5; i++) {
    const u = 0.15 + i * 0.17;
    const yy = lerp(top, bottom, u);
    const half = Math.sin(u * Math.PI) * w;
    s.set(x - half - 0.5, yy, F[4]);
    s.set(x + half + 0.5, yy, F[4]);
  }
  s.commit(false);
}

function eyes(s: SpriteCanvas, p: HeartPose, time: number): void {
  const { x, y } = HEART;
  const blink = Math.sin(time * 0.9) > 0.97;
  const spots: readonly Pt[] =
    p.open > 0
      ? [
          [x - 8, y - 4],
          [x + 8.5, y - 5],
          [x + 7, y + 3],
        ]
      : [
          [x + 3, y - 4],
          [x + 7.5, y - 1],
          [x - 3, y - 6],
        ];
  s.begin();
  spots.forEach(([ex, ey], i) => {
    const big = i === 0 ? 1.5 : 1;
    s.block(ex - big * 0.75, ey - 0.75, F[0], big * 1.5 + 0.5, 1.5);
    if (blink) return;
    const c = p.eyes > 1.2 ? BLIGHT.eyeHot : BLIGHT.eye;
    s.block(ex - big * 0.5, ey - 0.5, c, big, 1);
    s.set(ex - big * 0.5, ey - 0.5, WHITE);
  });
  s.commit(false);
}

function arm(s: SpriteCanvas, shoulder: Pt, a: ArmPose, near: boolean): void {
  const base = near ? BLIGHT.stem[2] : BLIGHT.stem[1];
  s.begin();
  s.taper(shoulder[0], shoulder[1], a.elbow[0], a.elbow[1], near ? 2.6 : 2.2, 1.8, base, near ? 2 : -2);
  s.taper(a.elbow[0], a.elbow[1], a.hand[0], a.hand[1], 1.8, 1.1, base, near ? -1.5 : 1.5);
  s.shadeEdges(base, near ? BLIGHT.stem[3] : BLIGHT.stem[2], BLIGHT.stem[0], 1);
  s.commit();
  s.begin();
  const dx = a.hand[0] - a.elbow[0];
  const dy = a.hand[1] - a.elbow[1];
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  for (const spread of [-0.7, 0, 0.7]) {
    const c = Math.cos(spread);
    const sn = Math.sin(spread);
    const tx = a.hand[0] + (ux * c - uy * sn) * 4.5;
    const ty = a.hand[1] + (ux * sn + uy * c) * 4.5;
    s.taper(a.hand[0], a.hand[1], tx, ty, 0.8, 0.25, BLIGHT.bone[2], spread * 2);
  }
  s.shadeEdges(BLIGHT.bone[2], BLIGHT.bone[3], BLIGHT.bone[1]);
  s.commit();
  s.begin();
  for (let i = 1; i < 4; i++) {
    const u = i / 4;
    const tx = lerp(shoulder[0], a.elbow[0], u);
    const ty = lerp(shoulder[1], a.elbow[1], u);
    s.set(tx, ty - 2, BLIGHT.bone[3]);
    s.set(tx + 0.5, ty - 2.5, BLIGHT.bone[3]);
  }
  s.set(a.elbow[0], a.elbow[1] - 1.5, BLIGHT.spore[3]);
  s.commit(false);
}

export function drawSporeheart(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = heartPose(e, time, (m) => windTime(e, m));
  s.clear();
  throne(s, p.core);
  if (!p.hideArms) arm(s, [HEART.x - 9, HEART.y - 2], p.back, false);
  arteries(s, p);
  heart(s, p, time);
  core(s, p, time);
  eyes(s, p, time);
  rootBase(s);
  if (!p.hideArms) arm(s, [HEART.x + 9, HEART.y - 2], p.front, true);
  s.outline(BLIGHT.outline);
  s.clipBelow(1);
  return s;
}
