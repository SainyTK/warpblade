import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { FOE } from "../colors";
import { facet, oval, shardPoints } from "../shapes";
import { MITE_COLORS } from "./colors";
import { type MitePose, mitePose } from "./pose";

const canvas = detailCanvas(26, 20, 13, 17);
const S = MITE_COLORS.shell;
const C = FOE.crystal;
const LEG_X = [-4, -1.5, 1.5, 4] as const;

function legs(s: SpriteCanvas, p: MitePose, top: number): void {
  s.begin();
  LEG_X.forEach((x, i) => {
    const foot = x * 1.25 + p.legs[i] * 0.6;
    s.hairline(x, top, foot, -0.5, MITE_COLORS.leg);
    s.set(foot, -0.5, S[0]);
  });
  s.commit();
}

function shell(s: SpriteCanvas, p: MitePose): { cy: number; ry: number } {
  const ry = 4 * (1 - p.squash);
  const rx = 6 * (1 + p.squash * 0.5);
  const cy = -1.5 - ry + p.rise;
  s.begin();
  oval(s, 0, cy, rx, ry, S[2]);
  s.shadeEdges(S[2], S[3], S[1], 2);
  s.hairline(-rx + 1.5, cy + ry - 1, rx - 1.5, cy + ry - 1, MITE_COLORS.belly);
  s.hairline(-rx + 2.5, cy - ry + 1.5, 1, cy - ry + 0.8, S[4]);
  s.set(-2.5, cy - 1, S[1]);
  s.set(-0.5, cy + 0.5, S[1]);
  s.commit();
  return { cy, ry };
}

function spines(s: SpriteCanvas, p: MitePose, cy: number, ry: number): void {
  const top = cy - ry + 1;
  const hot = p.glare;
  for (const [x, len, angle] of [
    [-3.5, 3, -2.2],
    [-0.5, 4, -1.75],
    [2.5, 3, -1.25],
  ] as const)
    facet(s, shardPoints(x, top + Math.abs(x) * 0.25, len * p.spines, angle, 1.1), hot ? C[2] : C[1], C[4], C[0]);
}

function face(s: SpriteCanvas, p: MitePose, cy: number): void {
  s.begin();
  s.block(3.5, cy - 0.5 + p.tilt * 0.3, p.glare ? FOE.eyeHot : FOE.eye, 1, 1);
  s.block(5, cy + p.tilt * 0.3, p.glare ? FOE.eyeHot : FOE.eye, 1, 1);
  s.hairline(5.5, cy + 2, 7, cy + 2.6 + p.tilt * 0.4, MITE_COLORS.leg);
  s.commit();
}

export function drawFrostmite(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const p = mitePose(e, t + e.seed);
  s.clear();
  const { cy, ry } = shell(s, p);
  legs(s, p, cy + ry - 1);
  spines(s, p, cy, ry);
  face(s, p, cy);
  s.outline(FOE.outline);
  return s;
}
