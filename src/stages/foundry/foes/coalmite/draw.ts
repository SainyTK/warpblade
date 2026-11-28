import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { FORGE } from "../../colors";
import { type MitePose, mitePose } from "./pose";

type Pt = readonly [number, number];
const canvas = detailCanvas(28, 26, 14, 22);
const I = FORGE.iron;
const C = FORGE.crust;
const M = FORGE.molten;
const LEGS: readonly (readonly [hip: number, phase: number])[] = [
  [-4, 0],
  [0, 2.1],
  [4, 4.2],
];
const CRACKS: readonly (readonly [Pt, Pt, Pt])[] = [
  [
    [-3.5, -0.45],
    [-1.6, -0.62],
    [-0.4, -0.3],
  ],
  [
    [1, -0.8],
    [2.4, -0.55],
    [3.8, -0.7],
  ],
];

function legs(s: SpriteCanvas, p: MitePose, near: boolean): void {
  const base = -1.6 - p.lift;
  s.begin();
  for (const [hip, phase] of LEGS) {
    const swing = p.tuck ? 0 : Math.sin(phase + p.stride * 2) * 1.4;
    const x = hip + (near ? 0.6 : -0.6);
    const kneeY = base - 1.4 + p.tuck * 1.2;
    const footY = p.tuck ? base + 0.4 : 0;
    s.hairline(x, base, x + swing * 0.5 + (hip < 0 ? -1 : 1), kneeY, near ? C[2] : C[1]);
    s.hairline(
      x + swing * 0.5 + (hip < 0 ? -1 : 1),
      kneeY,
      x + swing + (hip < 0 ? -1.5 : 1.5),
      footY,
      near ? C[3] : C[1],
    );
  }
  s.commit(false);
}

function body(s: SpriteCanvas, p: MitePose): void {
  const top = -1.5 - p.lift - p.tall;
  const floor = -1.5 - p.lift;
  const w = p.wide;
  const shell: Pt[] = [
    [-w, floor],
    [-w - 0.4, floor - p.tall * 0.45],
    [-w * 0.55, top + 0.6],
    [-w * 0.05, top],
    [w * 0.5, top + 0.4],
    [w + 0.6, floor - p.tall * 0.5],
    [w + 0.2, floor],
  ];
  s.begin();
  s.poly(shell, I[1]);
  s.shadeEdges(I[1], I[2], FORGE.soot, 2);
  s.commit();
  s.begin();
  s.poly(
    [
      [-w * 0.55, top + 0.6],
      [-w * 0.05, top],
      [w * 0.2, floor - p.tall * 0.55],
      [-w * 0.7, floor - p.tall * 0.4],
    ],
    I[2],
  );
  s.shadeEdges(I[2], I[3], I[1]);
  s.commit();
  s.begin();
  const hot = p.heat > 0.55 ? M[4] : p.heat > 0.2 ? M[3] : M[2];
  for (const crack of CRACKS) {
    const pts = crack.map(([u, v]): Pt => [u * (w / 6.4), floor + v * p.tall]);
    s.hairline(pts[0][0], pts[0][1], pts[1][0], pts[1][1], hot);
    s.hairline(pts[1][0], pts[1][1], pts[2][0], pts[2][1], M[1]);
  }
  s.set(-w * 0.45, top + 1.2, FORGE.ironGlint);
  s.set(-w * 0.05, top + 0.4, I[4]);
  s.hairline(-w + 0.5, floor - 0.5, w - 0.5, floor - 0.5, M[1]);
  s.commit(false);
}

function eyes(s: SpriteCanvas, p: MitePose): void {
  const y = -1.5 - p.lift - p.tall * 0.55;
  const x = p.wide * 0.62;
  s.begin();
  s.dot(x, y, 1.1, C[0]);
  s.dot(x - 2.2, y + 0.2, 0.9, C[0]);
  s.commit();
  s.begin();
  const lit = p.heat > 0.5 ? WHITE : FORGE.eye;
  if (p.hurt) {
    s.hairline(x - 0.6, y, x + 0.6, y, M[2]);
    s.hairline(x - 2.8, y + 0.2, x - 1.8, y + 0.2, M[1]);
  } else {
    s.block(x - 0.25, y - 0.5, lit, 0.5, 1);
    s.block(x - 2.45, y - 0.3, p.heat > 0.5 ? M[5] : M[4], 0.5, 1);
  }
  s.set(p.wide + 0.4, y + 1.4, C[3]);
  s.set(p.wide + 0.9, y + 1.9, C[2]);
  s.commit(false);
}

export function drawCoalmite(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const p = mitePose(e, t + e.seed);
  s.clear();
  legs(s, p, false);
  body(s, p);
  legs(s, p, true);
  eyes(s, p);
  s.outline(FORGE.outline);
  return s;
}
