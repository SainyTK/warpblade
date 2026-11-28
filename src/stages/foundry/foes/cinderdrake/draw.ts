import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { DRAKE } from "./colors";
import { drawLeg, drawTail, drawTorso } from "./drawBody";
import { drawHead } from "./drawHead";
import { drawWing } from "./drawWing";
import { drakePose } from "./pose";

const canvas = detailCanvas(88, 72, 44, 38);

export function drawCinderdrake(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = drakePose(e, time);
  s.clear();
  drawWing(s, p, [3, -5], false);
  drawLeg(s, p, [-3.5, 2.5], true, false);
  drawLeg(s, p, [5, 2], false, false);
  drawTail(s, p);
  drawTorso(s, p, time);
  drawLeg(s, p, [-2, 3], true, true);
  drawHead(s, p);
  drawLeg(s, p, [6.5, 2.5], false, true);
  drawWing(s, p, [1, -4], true);
  s.outline(DRAKE.outline);
  return s;
}
