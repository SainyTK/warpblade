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
  const lift = p.wing * 6;
  const sweep = p.tuck * 4;
  const back = near ? 0 : 1.5;
  const root: Pt = [-1 - back * 0.5, -1];
  const tip: Pt = [-9 - sweep + back, -1 - lift];
  const elbow: Pt = [-5 - sweep * 0.5, -2 - lift * 0.6];
  const tone = near ? W[2] : W[1];
  s.begin();
  s.poly([root, elbow, tip, [tip[0] + 2.5, tip[1] + 3.2], [-5 - sweep * 0.4, 1.5 - lift * 0.2], [-2, 2]], tone);
  s.shadeEdges(tone, near ? W[3] : W[2], W[0]);
  s.hairline(root[0], root[1], elbow[0], elbow[1], near ? W[3] : W[2]);
  s.hairline(elbow[0], elbow[1], tip[0], tip[1], near ? FOE.crystal[4] : W[3]);
  s.hairline(elbow[0], elbow[1], -4.5 - sweep * 0.3, 1.5 - lift * 0.2, W[0]);
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
