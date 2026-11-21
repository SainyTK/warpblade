import { BODY } from "../constants/hero";
import { armReach, type HeroLook } from "../rig";
import type { Pose } from "../types/pose";
import type { Vec } from "../types/rig";
import { clamp } from "../utils/math";
import {
  atHip,
  atNeck,
  farShoulder,
  headCenter,
  isElbowFlipped,
  isMirrored,
  isTurned,
  nearShoulder,
} from "../utils/poseFrame";
import { PARTS } from "./atlas";
import { drawSpriteArm, drawSpriteLeg } from "./limbs";
import { createPartPainter, drawRotatedPart, segmentAngle } from "./paint";
import { drawSpriteTrails } from "./trails";

const SWORD_GRIP: Vec = [13, 15];
const SWORD_TIP_Y = 93;
const SWORD_HEIGHT = (BODY.bladeLength * PARTS.sword[3]) / (SWORD_TIP_Y - SWORD_GRIP[1]);

function coatLean(points: readonly Vec[], sign: number): number {
  const root = points[0];
  const end = points[Math.min(3, points.length - 1)];
  if (!root || !end || root === end) {
    return 0;
  }
  return clamp(segmentAngle(root, [root[0] + sign * (end[0] - root[0]), end[1]]), -0.9, 1.1);
}

export function drawKaelSprite(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  pose: Pose,
  look: HeroLook,
): Vec {
  const paint = createPartPainter(ctx, image);
  const near = nearShoulder(pose);
  const far = farShoulder(pose);
  const [elbow, hand] = armReach(near, [pose.fx, pose.fy], isElbowFlipped(pose.fe));
  const [farElbow, farHand] = armReach(far, [pose.bx, pose.by], isElbowFlipped(pose.be));
  const [headX, headY] = headCenter(pose);
  const head: Vec = [headX - 0.6, headY - 1];
  const neck: Vec = [pose.nx, pose.ny];
  const hip: Vec = [pose.hx, pose.hy];
  const spine = segmentAngle(neck, hip);
  const headAngle = spine * 0.55;
  const back = isTurned(pose);
  const sign = isMirrored(pose) ? -1 : 1;
  const hairTie = back ? 0.4 : -3.1;
  const ponytailAnchor: Vec = [head[0] + hairTie * Math.cos(headAngle), head[1] + hairTie * Math.sin(headAngle)];

  function swordArm(): void {
    if (look.sword) {
      ctx.save();
      ctx.filter = "none";
      drawRotatedPart(paint, PARTS.sword, hand, [5.7, SWORD_HEIGHT], pose.sa - Math.PI / 2, SWORD_GRIP);
      ctx.restore();
    }
    drawSpriteArm(ctx, paint, near, elbow, hand);
  }

  const freeArm = () => drawSpriteArm(ctx, paint, far, farElbow, farHand);
  const forwardLeg = () => drawSpriteLeg(ctx, paint, atHip(pose, 1.5, 0), [pose.ffx, pose.ffy], pose.fa);
  const trailingLeg = () => drawSpriteLeg(ctx, paint, atHip(pose, -1.5, 0), [pose.bfx, pose.bfy], pose.ba);
  const [backgroundArm, foregroundArm] = back ? [swordArm, freeArm] : [freeArm, swordArm];
  const [backgroundLeg, foregroundLeg] = back ? [forwardLeg, trailingLeg] : [trailingLeg, forwardLeg];

  ctx.save();
  ctx.scale(sign, 1);
  drawSpriteTrails(ctx, image, look.scarf, look.tail, atNeck(pose, -1.5, 0.75), ponytailAnchor, sign);
  ctx.filter = "brightness(72%)";
  backgroundArm();
  backgroundLeg();
  ctx.filter = "none";
  const coatAngle = spine + coatLean(look.scarf, sign) * 0.24 + look.flare * 0.065;
  paint(PARTS.coat, atHip(pose, -1.2, -1.4), [7.7, 13.1], coatAngle, [0.8, 0.08]);
  foregroundLeg();
  paint(back ? PARTS.rearTorso : PARTS.torso, neck, [11.25, 12.6], spine, [0.53, 0.1]);
  paint(back ? PARTS.rearHead : PARTS.head, head, [15.5, 14.6], headAngle);
  paint(PARTS.scarfKnot, atNeck(pose, -0.15, 0.6), [6, 3.3], spine, [0.5, 0.48]);
  foregroundArm();
  ctx.restore();
  return [hand[0] * sign, hand[1]];
}
