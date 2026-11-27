import { circle, polygon } from "../../../../engine/frame";
import { fineRing } from "../../../../game/effects/fine";
import type { ElementKit, FxShapeDraw } from "../../../../types/skillFx";
import { ease, smooth, TAU } from "../../../../utils/math";
import { drawFxSword, fadeOut, grade, type Point, rankOf } from "./parts";

const RADIUS = [5, 7, 9, 10] as const;
const STEPS = 16;

function emblem(kit: ElementKit, cx: number, cy: number, r: number, turn: number, alpha: number): void {
  const R = kit.look.ramp;
  const at = (a: number, rr: number, ox = 0, oy = 0): Point => [
    cx + Math.cos(a + turn) * rr + ox,
    cy + Math.sin(a + turn) * rr + oy,
  ];
  const half: Point[] = [];
  for (let i = 0; i <= STEPS; i++) half.push(at(-Math.PI / 2 + (Math.PI * i) / STEPS, r));
  const ux = Math.cos(turn + Math.PI / 2) * r * 0.5;
  const uy = Math.sin(turn + Math.PI / 2) * r * 0.5;
  for (let i = 0; i <= STEPS; i++) half.push(at(Math.PI / 2 - (Math.PI * i) / STEPS, r * 0.5, ux, uy));
  for (let i = 0; i <= STEPS; i++) half.push(at(Math.PI / 2 + (Math.PI * i) / STEPS, r * 0.5, -ux, -uy));
  circle(cx, cy, r, kit.look.dark, alpha * 0.9);
  polygon(half, R[3], alpha);
  circle(cx + ux, cy + uy, r * 0.16, kit.look.dark, alpha);
  circle(cx - ux, cy - uy, r * 0.16, R[4], alpha);
  fineRing(cx, cy, r, r, R[4], alpha);
}

export const YIN_YANG: FxShapeDraw = (cast, _at, kit, progress, fade) => {
  const rank = rankOf(cast);
  const R = kit.look.ramp;
  const r = RADIUS[rank] * grade(cast) * ease.outBack(Math.min(1, progress * 3));
  const alpha = fadeOut(progress, fade);
  const turn = progress * (2 + rank);
  const pair = rank >= 3 ? [-r * 1.05, r * 1.05] : [0];
  for (const dy of pair) emblem(kit, 0, dy, r, rank >= 3 && dy > 0 ? -turn : turn, alpha);
  if (rank >= 1) fineRing(0, 0, r * 1.5, r * (rank >= 3 ? 2.6 : 1.5), R[4], alpha * 0.8);
  if (rank >= 2) {
    const span = r * (rank >= 3 ? 3.2 : 2.2);
    drawFxSword(kit, 0, span * 0.5, -Math.PI / 2, span, alpha);
    for (let i = 0; i < 4 + rank * 2; i++) {
      const a = (i / (4 + rank * 2)) * TAU + turn;
      kit.motif(Math.cos(a) * r * 1.5, Math.sin(a) * r * 1.5, a, 2 + rank, alpha * 0.7, rank);
    }
  }
  if (rank >= 3) {
    const ring = smooth(0.1, 0.6, progress);
    fineRing(0, 0, r * 3 * ring, r * 3 * ring, R[3], alpha * 0.6);
  }
};
