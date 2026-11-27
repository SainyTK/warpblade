import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Color, Ramp } from "../../../../types/color";
import type { Enemy } from "../../../../types/enemy";
import { mix, WHITE } from "../../../../utils/color";
import { SKY_FOES as C } from "../colors";
import { NIMBIT as N } from "./colors";
import { type NimbitPose, nimbitPose } from "./pose";

const canvas = detailCanvas(30, 28, 15, 22);
const PUFFS = [
  [-3.6, -5.6, 3.4],
  [3.4, -5.4, 3.5],
  [0, -8.4, 4.6],
  [-1.8, -11.6, 2.6],
  [2.4, -11, 2.4],
] as const;

const toned = (p: NimbitPose): Ramp => N.puff.map((c, i) => mix(c, N.storm[i], p.storm)) as Ramp;

function feet(s: SpriteCanvas, p: NimbitPose): void {
  s.begin();
  for (const side of [-1, 1]) {
    const x = side * 2.4 + side * p.step * 0.8;
    const y = p.lift ? -1.4 : 0;
    s.block(x - 1, y - 1.6, N.foot[1], 2, 1.6);
  }
  s.shadeEdges(N.foot[1], N.foot[2], N.foot[0]);
  s.commit();
}

function body(s: SpriteCanvas, p: NimbitPose, tone: Ramp): void {
  const wide = 1 + p.squash * 0.09;
  const tall = 1 - p.squash * 0.11;
  s.begin();
  for (const [x, y, r] of PUFFS) s.dot(x * wide, y * tall, r, tone[1]);
  s.shadeEdges(tone[1], tone[2], tone[0], 2);
  s.commit();
  s.begin();
  s.dot(-1.4 * wide, -9.6 * tall, 2.2, tone[2]);
  s.dot(-3.6 * wide, -7 * tall, 1.5, tone[2]);
  s.shadeEdges(tone[2], tone[3], tone[2]);
  s.commit(false);
  s.set(-2.6 * wide, -11 * tall, WHITE);
}

function face(s: SpriteCanvas, p: NimbitPose): void {
  const tall = 1 - p.squash * 0.11;
  const ey = -7 * tall;
  s.begin();
  if (p.dazed) {
    s.set(1.2, ey, N.eye);
    s.set(4, ey, N.eye);
    s.set(1.7, ey - 0.5, N.eye);
    s.set(4.5, ey - 0.5, N.eye);
  } else {
    s.block(0.8, ey - 1, N.eye, 1.5, 1.5);
    s.block(3.6, ey - 1, N.eye, 1.5, 1.5);
    const glint: Color = p.storm > 0.5 ? N.spark[4] : WHITE;
    s.set(1.3, ey - 1, glint);
    s.set(4.1, ey - 1, glint);
  }
  s.set(0.2, ey + 1.2, N.cheek);
  s.set(5, ey + 1.2, N.cheek);
  s.commit(false);
}

function tuft(s: SpriteCanvas, p: NimbitPose): void {
  const tall = 1 - p.squash * 0.11;
  const top = -13.4 * tall;
  const hot = p.spark;
  s.begin();
  s.hairline(0.4, top + 0.6, 1.6, top - 1.6, hot ? N.spark[4] : N.spark[3]);
  s.hairline(1.6, top - 1.6, 0.8, top - 2.4, hot ? N.spark[4] : N.spark[2]);
  s.hairline(0.8, top - 2.4, 2.2, top - 4, hot ? WHITE : N.spark[3]);
  s.commit(false);
}

export function drawNimbit(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const p = nimbitPose(e, t + e.seed);
  const tone = toned(p);
  s.clear();
  feet(s, p);
  body(s, p, tone);
  face(s, p);
  tuft(s, p);
  s.outline(C.outline);
  return s;
}
