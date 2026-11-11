import { detailCanvas, type SpriteCanvas } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import { rigsFor } from "../night/rig";
import { AC, clipBelow } from "./colors";
import { drawArm, drawFist } from "./sovereignArms";
import { drawBlade, drawHilt, drawScrape, drawSmear } from "./sovereignBlade";
import { sovereignBody } from "./sovereignBody";
import { drawCorona, drawHead } from "./sovereignHead";
import { drawLegs } from "./sovereignLegs";
import { sovereignRim } from "./sovereignLight";
import { drawMantle } from "./sovereignMantle";
import { sovereignPose } from "./sovereignPose";
import { drawRift } from "./sovereignRift";
import { drawPauldron, drawTorso } from "./sovereignTorso";

/** wide enough for the cleave's smear on either side and tall enough for the blade raised to the sky */
const canvas = detailCanvas(136, 104, 68, 100);
const rigFor = rigsFor(canvas);

/**
 * The Abyss Sovereign, lit from the black sun's side: a crowned giant in black plate under a wine-dark mantle, a
 * visor of burning eyes under a crown of bone points, a slit of void light in its chest, and a great blade of void
 * light in both hands. It walks with the blade low, draws it back over its shoulder before a cleave and brings it
 * round in a smear of light, raises it to the sky to call the pillars, lifts it point down before driving it into the
 * floor, and sinks into a rift in the floor to rise behind the hero. Enraged, its plate cracks with void light, its
 * crown burns white under a black sun and its blade runs white hot.
 */
export function drawSovereign(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const g = rigFor(e.face);
  const time = t + e.seed;
  const pose = sovereignPose(e, time);
  const b = sovereignBody(g, pose, time, e.phase === 2, e.face > 0 ? 1 : -1);
  s.clear();
  drawCorona(b);
  drawSmear(b);
  drawMantle(b);
  if (pose.behind) {
    drawHilt(b);
    drawBlade(b);
  }
  drawArm(b, false);
  drawPauldron(b, false);
  drawLegs(b);
  drawTorso(b);
  drawArm(b, true);
  drawPauldron(b, true);
  drawHead(b);
  if (!pose.behind) {
    drawHilt(b);
    if (pose.both > 0.5) drawFist(b, false);
    drawFist(b, true);
  }
  sovereignRim(s);
  if (!pose.behind) drawBlade(b);
  clipBelow(s, 0);
  drawScrape(b);
  drawRift(b);
  g.finish(AC.outline);
  return s;
}
