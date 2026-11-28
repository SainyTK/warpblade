import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import type { Enemy } from "../../../../types/enemy";
import { mix, WHITE } from "../../../../utils/color";
import { clamp } from "../../../../utils/math";
import { VEIL } from "../colors";
import { WING } from "./constants";

const canvas = detailCanvas(34, 28, 17, 14);
const S = VEIL.stone;
type Pt = readonly [number, number];

interface WingPose {
  up: number;
  swept: number;
  heat: number;
  limp: boolean;
}

function poseOf(e: Enemy, time: number): WingPose {
  if (e.stun > 0 || e.air || e.stagger > 0) return { up: -0.6, swept: 0, heat: 0, limp: true };
  if (e.state === "wind") {
    const k = clamp(e.st / WING.wind);
    return { up: 0.8 + Math.sin(time * 50) * 0.1, swept: 0, heat: k, limp: false };
  }
  if (e.state === "dive") return { up: 0.2, swept: 1, heat: 1, limp: false };
  const pace = e.state === "recover" ? 22 : 13;
  return { up: Math.sin(time * pace), swept: 0, heat: 0, limp: false };
}

function wingPoints(side: number, p: WingPose): Pt[] {
  const u = p.up;
  const back = p.swept;
  const x = (v: number) => side * v * (1 - back) + back * (-v * 0.85 + side * 0.5);
  return [
    [side * 1.5, -1],
    [x(6.5), -5 - u * 4 + back * 3],
    [x(13), -3 - u * 7.5 + back * 3],
    [x(10.5), 1.5 - u * 3 + back],
    [x(7.5), 0.5 - u * 1.5],
    [x(4.5), 3 - u],
  ];
}

function wing(s: SpriteCanvas, side: number, p: WingPose, tone: Color, far: boolean): void {
  const pts = wingPoints(side, p);
  const pane = p.heat > 0.6 ? mix(tone, WHITE, 0.35) : tone;
  s.begin();
  s.poly(pts, pane);
  s.shadeEdges(pane, mix(pane, WHITE, 0.45), mix(pane, VEIL.crystal[0], 0.5));
  s.hairline(pts[0][0], pts[0][1], pts[1][0], pts[1][1], far ? S[1] : S[2]);
  s.hairline(pts[1][0], pts[1][1], pts[2][0], pts[2][1], far ? S[1] : S[3]);
  s.hairline(pts[1][0], pts[1][1], pts[3][0], pts[3][1], mix(pane, VEIL.crystal[0], 0.4));
  s.hairline(pts[1][0], pts[1][1], pts[4][0], pts[4][1], mix(pane, VEIL.crystal[0], 0.4));
  s.set(pts[2][0], pts[2][1], WHITE);
  s.commit(!far);
}

function body(s: SpriteCanvas, p: WingPose, time: number): void {
  s.begin();
  s.taper(0.5, -2.5, -0.5, -7, 1.3, 0.3, S[2]);
  s.taper(2.5, -2.5, 4, -6.5, 1.2, 0.3, S[2]);
  s.dot(1, 0, 3.2, S[2]);
  s.shadeEdges(S[2], S[4], S[1], 2);
  s.set(-0.5, -5.5, VEIL.crystal[3]);
  s.set(3.5, -5.5, VEIL.crystal[3]);
  const lit = p.heat > 0.5 || Math.sin(time * 2.5) > 0.8;
  s.set(3, -1, lit ? VEIL.eyeHot : VEIL.eye);
  s.set(1.5, -1, VEIL.eye);
  s.set(2.5, 1.5, S[5]);
  s.commit();
  s.begin();
  s.poly(
    [
      [1, 0.5],
      [2.5, 2],
      [1, 4],
      [-0.5, 2],
    ],
    p.heat > 0.5 ? VEIL.crystal[4] : VEIL.crystal[2],
  );
  s.set(1, 1.5, WHITE);
  s.hairline(0, 3.5, -0.5, 5.5, S[1]);
  s.hairline(2, 3.5, 2.5, 5.5, S[1]);
  s.commit();
}

export function drawGlimmerwing(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = poseOf(e, time);
  s.clear();
  s.shift(0, p.limp ? 1 : 0);
  wing(s, -1, p, mix(VEIL.prism[3], VEIL.crystal[1], 0.35), true);
  body(s, p, time);
  wing(s, 1, p, mix(VEIL.prism[0], VEIL.prism[1], 0.25 + 0.25 * Math.sin(time * 4)), false);
  s.outline(VEIL.outline);
  return s;
}
