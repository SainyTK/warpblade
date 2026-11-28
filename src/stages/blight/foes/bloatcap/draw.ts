import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { BLIGHT } from "../../colors";
import { drawCap } from "./drawCap";
import { drawEyes, drawGills, drawStalk, drawTendrils } from "./drawUnder";
import { poseOf } from "./pose";

const canvas = detailCanvas(48, 66, 24, 22);

export function drawBloatcap(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = poseOf(e, time);
  const fierce = e.state === "wind" || e.state === "shoot" || e.state === "summon";
  s.clear();
  s.shift(p.shiver * Math.sin(time * 60), Math.sin(time * 1.4) * 0.5);
  drawTendrils(s, p, time);
  drawStalk(s, p, fierce);
  drawGills(s, p, time);
  drawEyes(s, p, fierce);
  drawCap(s, p, time);
  s.outline(BLIGHT.outline);
  return s;
}
