import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { FOE } from "../colors";
import { oval, type Pt } from "../shapes";
import { FLIT_COLORS } from "./colors";
import { type FlitPose, flitPose } from "./pose";

const canvas = detailCanvas(34, 28, 17, 14);
const D = FLIT_COLORS.down;
const W = FLIT_COLORS.wing;

function wing(s: SpriteCanvas, p: FlitPose, near: boolean): void {
  const angle = (near ? -2.6 : -1.75) + p.wing * 0.7 + p.tuck * (near ? 0.5 : -0.4);
  const len = 9 - p.tuck * 3;
  const ux = Math.cos(angle);
  const uy = Math.sin(angle);
  const px = -uy;
  const py = ux;
  const side = near ? 1 : -1;
  const root: Pt = [-0.5, -1.5];
  const tip: Pt = [root[0] + ux * len, root[1] + uy * len];
  const tone = near ? W[2] : W[1];
  s.begin();
  s.poly(
    [
      root,
      tip,
      [tip[0] + px * 2 * side, tip[1] + py * 2 * side],
      [root[0] + ux * len * 0.7 + px * 3 * side, root[1] + uy * len * 0.7 + py * 3 * side],
      [root[0] + ux * len * 0.4 + px * 3.4 * side, root[1] + uy * len * 0.4 + py * 3.4 * side],
      [root[0] + px * 2 * side, root[1] + py * 2 * side],
    ],
    tone,
  );
  s.shadeEdges(tone, near ? W[3] : W[2], W[0]);
  s.hairline(root[0], root[1], tip[0], tip[1], near ? FOE.crystal[4] : W[3]);
  for (const u of [0.45, 0.75])
    s.hairline(
      root[0] + ux * len * u,
      root[1] + uy * len * u,
      root[0] + ux * len * u + px * 2.6 * side,
      root[1] + uy * len * u + py * 2.6 * side,
      W[0],
    );
  s.commit();
}

function body(s: SpriteCanvas, p: FlitPose): void {
  const y = p.pitch;
  s.begin();
  oval(s, 0, y, 3.6, 3.2, D[1]);
  s.dot(2.2, -1.6 + y, 2.4, D[1]);
  s.shadeEdges(D[1], D[3], D[0], 2);
  s.hairline(-2, y + 1.5, 1.5, y + 2.5, D[0]);
  s.commit();
  s.begin();
  s.poly(
    [
      [0.6, -3 + y],
      [0.2, -6 + y],
      [2.2, -3.6 + y],
    ],
    D[2],
  );
  s.poly(
    [
      [3, -3.6 + y],
      [4, -6.2 + y],
      [4.4, -3 + y],
    ],
    D[2],
  );
  s.shadeEdges(D[2], D[3], D[0]);
  s.commit();
  s.begin();
  s.block(3, -2 + y, p.glare ? FOE.eyeHot : FOE.eye, 1, 1);
  s.set(4.2, -0.6 + y, FOE.nose);
  s.set(4.6, 0 + y, FOE.crystal[3]);
  s.commit();
}

export function drawSnowflit(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const p = flitPose(e, t + e.seed);
  s.clear();
  wing(s, p, false);
  body(s, p);
  wing(s, p, true);
  s.outline(FOE.outline);
  return s;
}
