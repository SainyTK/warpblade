import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { FOE } from "../colors";
import { drawArm } from "./drawArm";
import { drawBackSpikes, drawCore, drawLeg, drawTorso } from "./drawBody";
import { drawHead, drawPauldron } from "./drawHead";
import { colossusPose } from "./pose";

const canvas = detailCanvas(88, 88, 44, 80);

export function drawFrostcolossus(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const p = colossusPose(e, t + e.seed);
  s.clear();
  s.shift(p.jolt, 0);
  drawPauldron(s, p, false);
  drawArm(s, p, false);
  drawLeg(s, p, false);
  drawLeg(s, p, true);
  drawBackSpikes(s, p);
  drawTorso(s, p);
  drawCore(s, p);
  drawHead(s, p);
  drawPauldron(s, p, true);
  drawArm(s, p, true);
  s.shift(0, 0);
  s.outline(FOE.outline);
  return s;
}
