import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { SEER as C } from "./colors";
import { drawLegs, drawShawl, drawTail, drawTorso } from "./drawBody";
import { drawArm, drawGills, drawHead } from "./drawHead";
import { drawStaff } from "./drawStaff";
import { seerPose } from "./pose";

const canvas = detailCanvas(64, 70, 30, 62);

export function drawReedseer(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = seerPose(e, t);
  s.clear();
  drawTail(s, p, time);
  drawLegs(s, p, false);
  drawGills(s, p, time, false);
  drawTorso(s, p);
  drawLegs(s, p, true);
  drawHead(s, p);
  drawShawl(s, p, time);
  drawGills(s, p, time, true);
  drawStaff(s, p, time);
  drawArm(s, p);
  s.outline(C.outline);
  return s;
}
