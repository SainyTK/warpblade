import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { moonlight } from "../../../../game/enemies/night/moonlight";
import type { Enemy } from "../../../../types/enemy";
import { LORD_COLORS } from "./colors";
import { drawArm } from "./drawArm";
import { drawCloak, drawCuirass, drawFaulds, drawPauldron } from "./drawBody";
import { drawHelm } from "./drawHelm";
import { drawLegs } from "./drawLegs";
import { drawSword } from "./drawSword";
import { lordPose } from "./pose";

const canvas = detailCanvas(76, 64, 34, 54);

export function drawBarrowlord(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = lordPose(e, time);
  s.clear();
  drawCloak(s, p, time);
  drawArm(s, p, -5, false);
  drawPauldron(s, -6.5 + p.lean * 0.8, -30 + p.crouch, false);
  drawLegs(s, p, false);
  drawLegs(s, p, true);
  drawFaulds(s, p);
  drawCuirass(s, p);
  drawHelm(s, p);
  drawSword(s, p);
  drawArm(s, p, 5, true);
  drawPauldron(s, 6.5 + p.lean, -30.5 + p.crouch, true);
  moonlight(s);
  s.outline(LORD_COLORS.outline);
  return s;
}
