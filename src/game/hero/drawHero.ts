import { HERO_COLORS as HC } from "../../constants/palette";
import type { SpriteCanvas } from "../../engine/sprite";
import type { Pose } from "../../types/pose";
import { scale } from "../../utils/color";
import { alongSpine, isMirrored, isTurned } from "../../utils/poseFrame";
import { armReach, drawArm } from "./draw/arm";
import { drawCoatTails } from "./draw/coatTails";
import { drawHead } from "./draw/head";
import { drawLeg } from "./draw/leg";
import type { Vec } from "./draw/reach";
import { drawSword } from "./draw/sword";
import { drawTorso } from "./draw/torso";
import { drawTrails } from "./draw/trails";

export interface HeroLook {
  /** scarf and ponytail points, local pixels from the feet */
  scarf: Vec[];
  tail: Vec[];
  /** how far the coat tails fly back */
  flare: number;
  sword: boolean;
}

/**
 * Draw Kael into the canvas, back to front. Facing the camera the sword arm is in front of the body;
 * with his back turned it swings behind it. A mirrored pose is drawn as authored, then flipped.
 * Returns where the near hand ended up, as drawn.
 */
export function drawHero(s: SpriteCanvas, p: Pose, look: HeroLook): Vec {
  const back = isTurned(p);
  const mirrored = isMirrored(p);
  const flip = (q: Vec): Vec => [-q[0], q[1]];
  s.clear();
  drawTrails(s, mirrored ? look.tail.map(flip) : look.tail, mirrored ? look.scarf.map(flip) : look.scarf);
  const neck: Vec = [p.nx, p.ny];
  const hip: Vec = [p.hx, p.hy];
  const nearShoulder = alongSpine(p, neck, 1, 2);
  const farShoulder = alongSpine(p, neck, -1, 2);
  const [elbow, hand] = armReach(nearShoulder, [p.fx, p.fy]);
  const [farElbow, farHand] = armReach(farShoulder, [p.bx, p.by]);
  const swordArm = () => {
    if (look.sword) drawSword(s, hand, p.sa);
    drawArm(s, nearShoulder, elbow, hand, back ? HC.coatDark : HC.coat, back ? scale(HC.glove, 0.8) : HC.glove, !back);
  };
  if (back) swordArm();
  else drawArm(s, farShoulder, farElbow, farHand, HC.coatDark, scale(HC.glove, 0.8), false);
  drawLeg(s, alongSpine(p, hip, -1.5, 0), [p.bfx, p.bfy], true);
  drawCoatTails(s, p, look.flare);
  drawLeg(s, alongSpine(p, hip, 1.5, 0), [p.ffx, p.ffy], false);
  drawTorso(s, p, back);
  drawHead(s, p, back);
  if (back) drawArm(s, farShoulder, farElbow, farHand, HC.coat, HC.glove, true);
  else swordArm();
  s.outline(HC.outline);
  if (!mirrored) return hand;
  s.mirror();
  return flip(hand);
}
