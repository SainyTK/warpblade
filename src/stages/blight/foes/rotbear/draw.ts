import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { bodyAxis } from "./axis";
import { BEAR } from "./colors";
import { drawShelves, drawStalks } from "./drawGrowth";
import { drawHead } from "./drawHead";
import { drawGuardShelf, drawLeg } from "./drawLimbs";
import { drawChest, drawTorso } from "./drawTorso";
import { bearPose } from "./pose";

const canvas = detailCanvas(80, 70, 38, 64);

export function drawRotbear(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = bearPose(e, time);
  const a = bodyAxis(p);
  const hipLeg = a.at(0.05, -3);
  const shoulderLeg = a.at(0.92, -3);
  s.clear();
  drawLeg(s, [hipLeg[0] - 3, hipLeg[1]], p.hindFar, false, true);
  drawLeg(s, [shoulderLeg[0] - 2, shoulderLeg[1]], p.frontFar, false, false);
  drawStalks(s, p, a, time);
  drawTorso(s, p, a);
  drawShelves(s, a);
  drawChest(s, p, a, time);
  drawLeg(s, hipLeg, p.hindNear, true, true);
  drawHead(s, p, time);
  drawLeg(s, shoulderLeg, p.frontNear, true, false);
  drawGuardShelf(s, shoulderLeg, p.frontNear, e.state === "walk");
  s.outline(BEAR.outline);
  return s;
}
