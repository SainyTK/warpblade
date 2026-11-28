import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { BLIGHT } from "../../colors";
import { cap, face } from "./drawCap";
import { backArm, body, legs, strands } from "./drawFigure";
import { bulb, frontArm, staff } from "./drawStaff";
import { poseOf } from "./pose";

const canvas = detailCanvas(60, 66, 28, 62);

export function drawHyphamancer(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = poseOf(e, time);
  const fierce = e.state === "summon" || e.state === "wind" || e.state === "shoot";
  s.clear();
  s.shift(0, p.bob);
  backArm(s, p, time);
  legs(s, p, false);
  body(s, p, time);
  legs(s, p, true);
  face(s, p, fierce);
  cap(s, p, time);
  strands(s, p, time);
  staff(s, p);
  frontArm(s, p);
  bulb(s, p, time);
  s.outline(BLIGHT.outline);
  return s;
}
