import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { lerp } from "../../../../utils/math";
import { SKY_FOES as C } from "../colors";
import { featherWing, type WingStyle } from "../wing";
import { FINCH as F } from "./colors";
import { type FinchPose, finchPose } from "./pose";

const canvas = detailCanvas(30, 26, 15, 13);
const WING: WingStyle = { span: 9, chord: 4.2, fingers: 4, feathers: F.back, tip: F.crest[3], tipHot: F.crest[4] };
const RAISED = -Math.PI / 2 - 0.5;
const LOWERED = Math.PI / 2 + 0.3;
const FOLDED = Math.PI - 0.2;

type At = (x: number, y: number) => readonly [number, number];

function tail(s: SpriteCanvas, at: At): void {
  s.begin();
  s.poly([at(-3, -0.8), at(-8, -2.4), at(-8.6, -0.6), at(-7.6, 1.4), at(-3, 1)], F.back[2]);
  s.shadeEdges(F.back[2], F.back[3], F.back[1]);
  const [nx, ny] = at(-8.2, -0.6);
  s.set(nx, ny, F.belly[2]);
  s.commit();
}

function body(s: SpriteCanvas, at: At): void {
  const [x0, y0] = at(-3.6, 0);
  const [x1, y1] = at(2.6, -0.4);
  s.begin();
  s.taper(x0, y0, x1, y1, 2, 2.2, F.back[2], 0.3);
  s.shadeEdges(F.back[2], F.back[3], F.back[1], 2);
  s.commit();
  s.begin();
  const [bx, by] = at(0.6, 1);
  s.dot(bx, by, 1.5, F.belly[1]);
  s.shadeEdges(F.belly[1], F.belly[2], F.belly[0]);
  s.commit();
}

function head(s: SpriteCanvas, at: At, p: FinchPose): void {
  s.begin();
  const [hx, hy] = at(4, -1.6);
  s.dot(hx, hy, 2, F.back[3]);
  s.shadeEdges(F.back[3], F.back[4], F.back[2]);
  s.commit();
  s.begin();
  const [c0, c1] = at(3, -3.2);
  const [t0, t1] = at(1.4, -5.4);
  s.hairline(c0, c1, t0, t1, p.charge > 0.4 ? F.crest[4] : F.crest[3]);
  s.set(t0, t1, p.charge > 0.4 ? WHITE : F.crest[4]);
  s.commit(false);
  s.begin();
  s.poly([at(5.6, -2.2), at(7.8, -1.4), at(5.6, -0.8)], F.beak[2]);
  s.shadeEdges(F.beak[2], F.beak[3], F.beak[1]);
  s.commit();
  s.begin();
  const [ex, ey] = at(4.6, -2);
  s.block(ex - 0.5, ey - 0.5, F.eye);
  s.set(ex, ey - 0.5, p.charge > 0.4 ? F.crest[4] : WHITE);
  s.commit(false);
}

const wingAngle = (p: FinchPose): number => (p.spread < 0.2 ? FOLDED : lerp(RAISED, LOWERED, (p.flap + 1) / 2));

export function drawSquallfinch(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const p = finchPose(e, t + e.seed);
  const cos = Math.cos(p.tilt);
  const sin = Math.sin(p.tilt);
  const at: At = (x, y) => [x * cos - y * sin, x * sin + y * cos];
  const angle = wingAngle(p) + p.tilt;
  const [rx, ry] = at(0, -1);
  s.clear();
  featherWing(
    s,
    { x: rx - 0.8, y: ry - 0.4, angle: angle - 0.25, spread: p.spread, dim: 0.62, charge: p.charge },
    WING,
  );
  tail(s, at);
  body(s, at);
  head(s, at, p);
  featherWing(s, { x: rx, y: ry, angle, spread: p.spread, dim: 1, charge: p.charge }, WING);
  s.outline(C.outline);
  return s;
}
