import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { drawBody, drawFarSide, drawShieldArm } from "./body";
import { SENTINEL_COLORS as C } from "./colors";
import { drawHalberd } from "./halberd";
import { sentinelPose } from "./pose";
import { drawShield } from "./shield";

const canvas = detailCanvas(76, 62, 34, 54);

export function drawSentinel(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const p = sentinelPose(e, t + e.seed);
  s.clear();
  if (!p.front) drawHalberd(s, p);
  drawFarSide(s, p);
  drawBody(s, p);
  drawShieldArm(s, p);
  drawShield(s, p);
  if (p.front) drawHalberd(s, p);
  s.outline(C.outline);
  return s;
}
