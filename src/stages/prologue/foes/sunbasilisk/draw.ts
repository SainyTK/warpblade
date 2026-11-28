import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { BASILISK_COLORS as C } from "./colors";
import { drawBody } from "./drawBody";
import { drawCrest } from "./drawCrest";
import { drawHead } from "./drawHead";
import { drawFarLegs, drawNearLegs } from "./drawLegs";
import { drawRattle } from "./drawRattle";
import { basiliskPose } from "./pose";
import { basiliskSpine } from "./spine";

const canvas = detailCanvas(124, 64, 64, 54);

export function drawBasilisk(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = basiliskPose(e, time);
  const spine = basiliskSpine(p, time);
  const neck = spine[spine.length - 1];
  const hx = neck.x + 4 + p.headX;
  const hy = neck.y + p.headY;
  s.clear();
  s.shift(p.shiftX, 0);
  drawFarLegs(s, spine, p.stride);
  drawCrest(s, hx, hy, p, time);
  drawBody(s, spine, Math.max(p.charge, p.crest * 0.3));
  drawRattle(s, spine, p.coil, time);
  drawHead(s, hx, hy, p, time);
  drawNearLegs(s, spine, p.stride);
  s.shift(0, 0);
  s.outline(C.outline);
  return s;
}
