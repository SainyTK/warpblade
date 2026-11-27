import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { FOE } from "../colors";
import { facet, type Pt, shardPoints } from "../shapes";
import { BELL_COLORS } from "./colors";
import { type BellPose, bellPose } from "./pose";

const canvas = detailCanvas(44, 48, 22, 22);
const I = BELL_COLORS.ice;
const R = BELL_COLORS.rune;
const PIVOT_Y = -14;

const BODY: readonly Pt[] = [
  [-4, -14],
  [4, -14],
  [7, -9],
  [8, -1],
  [10.5, 6],
  [12, 9],
  [-12, 9],
  [-10.5, 6],
  [-8, -1],
  [-7, -9],
];

function turn(p: Pt, tilt: number): Pt {
  const c = Math.cos(tilt);
  const s = Math.sin(tilt);
  const y = p[1] - PIVOT_Y;
  return [p[0] * c - y * s, PIVOT_Y + p[0] * s + y * c];
}

const turned = (pts: readonly Pt[], tilt: number): Pt[] => pts.map((p) => turn(p, tilt));

function clapper(s: SpriteCanvas, p: BellPose): void {
  const top = turn([0, 4], p.tilt);
  const a = p.tilt + p.clapper + Math.PI / 2;
  const tip: Pt = [top[0] + Math.cos(a) * 11, top[1] + Math.sin(a) * 11];
  s.begin();
  s.taper(top[0], top[1], tip[0], tip[1], 1.6, 0.4, BELL_COLORS.clapper[1]);
  s.shadeEdges(BELL_COLORS.clapper[1], BELL_COLORS.clapper[2], BELL_COLORS.clapper[0]);
  s.commit();
}

function body(s: SpriteCanvas, p: BellPose): void {
  s.begin();
  s.poly(turned(BODY, p.tilt), I[2]);
  s.shadeEdges(I[2], I[3], I[1], 2);
  const [l0, l1] = [turn([-11, 6.5], p.tilt), turn([11, 6.5], p.tilt)];
  s.hairline(l0[0], l0[1], l1[0], l1[1], I[4]);
  const [r0, r1] = [turn([-6, -6], p.tilt), turn([6, -6], p.tilt)];
  s.hairline(r0[0], r0[1], r1[0], r1[1], I[1]);
  const [h0, h1] = [turn([-2.5, -12], p.tilt), turn([-6, 5], p.tilt)];
  s.hairline(h0[0], h0[1], h1[0], h1[1], I[4]);
  s.commit();
  s.begin();
  s.poly(
    turned(
      [
        [-10, 9],
        [10, 9],
        [8, 11],
        [-8, 11],
      ],
      p.tilt,
    ),
    BELL_COLORS.hollow,
  );
  s.commit();
}

function face(s: SpriteCanvas, p: BellPose): void {
  const eye = p.glow > 0.6 ? R[2] : R[1];
  s.begin();
  for (const x of [-3.5, 2.5]) {
    const a = turn([x, -3], p.tilt);
    s.block(a[0], a[1], eye, 1.2, 0.6 + p.open * 0.6);
  }
  const m = turn([-1.5, 2], p.tilt);
  s.block(m[0], m[1], p.open > 0.5 ? R[2] : I[0], 2.5, 0.5 + p.open * 1.5);
  s.commit(false);
}

function crown(s: SpriteCanvas, p: BellPose): void {
  for (const [x, len, a] of [
    [-3, 5, -2.1],
    [0, 7, -1.57],
    [3, 5, -1.05],
  ] as const) {
    const base = turn([x, -14], p.tilt);
    facet(s, shardPoints(base[0], base[1], len, a + p.tilt, 1.3), FOE.crystal[1], FOE.crystal[4], FOE.crystal[0]);
  }
  for (const side of [-1, 1]) {
    const base = turn([side * 11, 9], p.tilt);
    facet(s, shardPoints(base[0], base[1], 5, Math.PI / 2 + p.tilt - side * 0.25, 1.1), I[3], I[4], I[1]);
  }
}

export function drawFrostbell(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const p = bellPose(e, t + e.seed);
  s.clear();
  s.shift(p.jolt, 0);
  clapper(s, p);
  crown(s, p);
  body(s, p);
  face(s, p);
  s.shift(0, 0);
  s.outline(FOE.outline);
  return s;
}
