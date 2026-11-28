import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { drawBackArm, drawBody, drawLegs, drawNearArm } from "./body";
import { ROOTCALLER_COLORS as C } from "./colors";
import { drawHead } from "./head";
import { rootcallerPose } from "./pose";
import { drawStaff } from "./staff";
import { drawWardBack, drawWardFront } from "./ward";

const canvas = detailCanvas(56, 66, 26, 58);

export function drawRootcaller(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = rootcallerPose(e, time);
  s.clear();
  drawWardBack(s, p.ward, time);
  drawBackArm(s, p);
  drawLegs(s, p);
  drawBody(s, p, time);
  drawHead(s, p, p.heat > 0.6);
  drawStaff(s, p, time);
  drawNearArm(s, p);
  drawWardFront(s, p.ward, time);
  s.outline(C.outline);
  return s;
}
