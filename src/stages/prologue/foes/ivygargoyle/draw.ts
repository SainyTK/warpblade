import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { drawFarLimbs, drawGargoyleBody, drawTail } from "./body";
import { GARGOYLE_COLORS as C } from "./colors";
import { gargoylePose } from "./pose";
import { drawWing } from "./wing";

const canvas = detailCanvas(72, 64, 36, 34);

export function drawGargoyle(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const p = gargoylePose(e, t + e.seed);
  s.clear();
  drawWing(s, 0, -5.5 + p.bob, p.wing + 0.3, p.span * 0.9, false);
  drawTail(s, p);
  drawFarLimbs(s, p);
  drawGargoyleBody(s, p);
  drawWing(s, -2, -4.5 + p.bob, p.wing, p.span, true);
  s.outline(C.outline);
  return s;
}
