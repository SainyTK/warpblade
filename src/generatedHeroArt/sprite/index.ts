import { armReach } from "../../rig";
import type { Vec } from "../../types/rig";
import { clamp } from "../../utils/math";
import {
  atHip,
  atNeck,
  farShoulder,
  headCenter,
  isElbowFlipped,
  isMirrored,
  isTurned,
  nearShoulder,
} from "../../utils/poseFrame";
import type { GeneratedHeroArt, SpriteProfile } from "../types";
import { PARTS } from "./atlas";
import { drawSpriteArm, drawSpriteLeg } from "./limbs";
import { createPartPainter, headAngle, segmentAngle } from "./paint";
import { drawSpriteTrails } from "./trails";
import { createWeaponArt } from "./weapon";

export { ATLAS_SIZE } from "./atlas";
export { outlineHeroSprite } from "./outline";

const HEAD_SIZE: Vec = [15.5, 14.6];
const SHIELD_HEIGHT = 12;
const HOLSTER_HEIGHT = 14;

function coatLean(points: readonly Vec[], sign: number): number {
  const root = points[0];
  const end = points[Math.min(3, points.length - 1)];
  if (!root || !end || root === end) {
    return 0;
  }
  return clamp(segmentAngle(root, [root[0] + sign * (end[0] - root[0]), end[1]]), -0.9, 1.1);
}

export function createHeroSprite(
  image: HTMLImageElement,
  profile: SpriteProfile,
  offhand?: HTMLImageElement,
): GeneratedHeroArt {
  const headScale = profile.headScale ?? 1;
  const headSize: Vec = [HEAD_SIZE[0] * headScale, HEAD_SIZE[1] * headScale];
  const [headDx, headDy] = profile.headOffset ?? [0, 0];
  return (ctx, pose, look, skin) => {
    const paint = createPartPainter(ctx, image);
    const weapon = createWeaponArt(ctx, paint, profile, skin.blade.reach, offhand);
    const near = nearShoulder(pose);
    const far = farShoulder(pose);
    const [elbow, hand] = armReach(near, [pose.fx, pose.fy], isElbowFlipped(pose.fe));
    const [farElbow, farHand] = armReach(far, [pose.bx, pose.by], isElbowFlipped(pose.be));
    const [headX, headY] = headCenter(pose);
    const head: Vec = [headX - 0.6 + headDx, headY - 1 + headDy];
    const neck: Vec = [pose.nx, pose.ny];
    const spine = segmentAngle(neck, [pose.hx, pose.hy]);
    const tilt = headAngle(spine);
    const back = isTurned(pose);
    const sign = isMirrored(pose) ? -1 : 1;
    const hairTie = (back ? 0.4 : -3.1) * headScale;
    const belt = skin.scarfAt === "belt";
    const display = skin.bladeDisplay?.(pose.bs) ?? "drawn";
    const holster = atHip(pose, -2.4, -0.3);
    const holsterAngle = spine + 0.55;
    const { scarfTail, ponytail } = profile.trails;

    function swordArm(): void {
      if (look.sword && display !== "sheathed") {
        ctx.save();
        ctx.filter = "none";
        const angle = pose.sa - Math.PI / 2;
        if (display === "heldSheathed") {
          weapon.drawOffhand(hand, angle, skin.blade.reach);
          weapon.drawGrip(hand, angle);
        } else {
          weapon.draw(hand, angle);
        }
        ctx.restore();
      }
      drawSpriteArm(ctx, paint, near, elbow, hand);
    }

    function freeArm(): void {
      if (skin.offhand?.held) {
        weapon.drawOffhand(farHand, pose.oa - Math.PI / 2, SHIELD_HEIGHT);
      }
      drawSpriteArm(ctx, paint, far, farElbow, farHand);
    }

    const forwardLeg = () => drawSpriteLeg(ctx, paint, atHip(pose, 1.5, 0), [pose.ffx, pose.ffy], pose.fa);
    const trailingLeg = () => drawSpriteLeg(ctx, paint, atHip(pose, -1.5, 0), [pose.bfx, pose.bfy], pose.ba);
    const [backgroundArm, foregroundArm] = back ? [swordArm, freeArm] : [freeArm, swordArm];
    const [backgroundLeg, foregroundLeg] = back ? [forwardLeg, trailingLeg] : [trailingLeg, forwardLeg];

    ctx.save();
    ctx.scale(sign, 1);
    drawSpriteTrails(
      ctx,
      image,
      scarfTail && {
        points: look.scarf,
        anchor: belt ? atHip(pose, -2.5, -1.5) : atNeck(pose, -1.5, 0.75),
        centers: scarfTail,
      },
      ponytail && {
        points: look.tail,
        anchor: [head[0] + hairTie * Math.cos(tilt), head[1] + hairTie * Math.sin(tilt)],
        centers: ponytail,
      },
      sign,
    );
    ctx.filter = "brightness(72%)";
    backgroundArm();
    backgroundLeg();
    ctx.filter = "none";
    const coatAngle = spine + coatLean(look.scarf, sign) * 0.24 + look.flare * 0.065;
    paint(PARTS.coat, atHip(pose, -1.2, -1.4), [7.7, 13.1], coatAngle, [0.8, 0.08]);
    foregroundLeg();
    if (skin.offhand?.hip && display !== "heldSheathed") {
      weapon.drawOffhand(holster, holsterAngle, HOLSTER_HEIGHT);
      if (look.sword && display === "sheathed") {
        weapon.drawGrip(holster, holsterAngle);
      }
    }
    paint(back ? PARTS.rearTorso : PARTS.torso, neck, [11.25, 12.6], spine, [0.53, 0.1]);
    paint(back ? PARTS.rearHead : PARTS.head, head, headSize, tilt);
    const knot = belt ? atHip(pose, -2.5, -1.5) : atNeck(pose, -0.15, 0.6);
    paint(PARTS.scarfKnot, knot, [6, 3.3], spine, [0.5, 0.48]);
    foregroundArm();
    ctx.restore();
    return [hand[0] * sign, hand[1]];
  };
}
