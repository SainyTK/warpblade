import { HERO_COLORS as HC } from "../../constants/palette";
import type { SpriteCanvas } from "../../engine/sprite";
import type { Pose } from "../../types/pose";
import { atHip, farShoulder, isElbowFlipped, isMirrored, isTurned, nearShoulder } from "../../utils/poseFrame";
import { armReach, drawArm } from "./draw/arm";
import { drawBraid } from "./draw/braid";
import { drawCoatTails } from "./draw/coatTails";
import { drawDrum, drawMallet, farMalletAngle } from "./draw/drum";
import { drawHead } from "./draw/head";
import { drawKnife, farKnifeAngle } from "./draw/knives";
import { drawLeg } from "./draw/leg";
import type { Vec } from "./draw/reach";
import { drawSatchel } from "./draw/satchel";
import { drawSword } from "./draw/sword";
import { drawTorso } from "./draw/torso";
import { drawTrails } from "./draw/trails";
import { skin } from "./skin";

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
  const rope = mirrored ? look.scarf.map(flip) : look.scarf;
  // a braided hero wears one braid over her back along the scarf's rope, and neither scarf nor ponytail
  if (!skin.braid) drawTrails(s, mirrored ? look.tail.map(flip) : look.tail, rope);
  const near = nearShoulder(p);
  const far = farShoulder(p);
  const [elbow, hand] = armReach(near, [p.fx, p.fy], isElbowFlipped(p.fe));
  const [farElbow, farHand] = armReach(far, [p.bx, p.by], isElbowFlipped(p.be));
  const swordArm = () => {
    if (look.sword) drawSword(s, hand, p.sa);
    drawArm(s, near, elbow, hand, !back);
  };
  // a knife fighter holds a second knife in the far hand, a drummer a second mallet
  const farArm = (front: boolean) => {
    if (skin.weapon === "knives" && look.sword) drawKnife(s, farHand, farKnifeAngle(farElbow, farHand), front);
    if (skin.weapon === "mallets" && look.sword) drawMallet(s, farHand, farMalletAngle(farElbow, farHand), front);
    drawArm(s, far, farElbow, farHand, front);
  };
  if (back) swordArm();
  else farArm(false);
  drawLeg(s, atHip(p, -1.5, 0), [p.bfx, p.bfy], p.ba, true);
  drawCoatTails(s, p, look.flare);
  drawLeg(s, atHip(p, 1.5, 0), [p.ffx, p.ffy], p.fa, false);
  drawTorso(s, p, back);
  if (skin.satchel && !back) drawSatchel(s, p);
  if (skin.drum && !back) drawDrum(s, p);
  if (skin.braid) drawBraid(s, rope);
  drawHead(s, p, back);
  if (back) farArm(true);
  else swordArm();
  s.outline(HC.outline);
  if (!mirrored) return hand;
  s.mirror();
  return flip(hand);
}
