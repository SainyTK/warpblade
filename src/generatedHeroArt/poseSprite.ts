import { createPartPainter, drawRotatedPart, PARTS, type PartPainter, type Rect, segmentAngle } from "../kaelSprite";
import { armReach, legReach } from "../rig";
import type { Vec } from "../types/rig";
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
import type { GeneratedHeroArt, SpriteProfile } from "./types";

const CAP = 0.8;

function segment(paint: PartPainter, rect: Rect, a: Vec, b: Vec, width: number): void {
  const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const height = Math.max(0.1, length) + 2 * CAP;
  paint(rect, a, [width, height], segmentAngle(a, b), [0.5, CAP / height]);
}

function hangingAngle(path: readonly Vec[], sign: number): number {
  const first = path[0];
  const tip = path.at(-1);
  if (!first || !tip || first === tip) {
    return 0;
  }
  return segmentAngle(first, [first[0] + (tip[0] - first[0]) * sign, tip[1]]);
}

export function createPoseSprite(
  image: HTMLImageElement,
  profile: SpriteProfile,
  offhand?: HTMLImageElement,
): GeneratedHeroArt {
  return (ctx, pose, look, skin) => {
    const paint = createPartPainter(ctx, image);
    const near = nearShoulder(pose);
    const far = farShoulder(pose);
    const [elbow, hand] = armReach(near, [pose.fx, pose.fy], isElbowFlipped(pose.fe));
    const [farElbow, otherHand] = armReach(far, [pose.bx, pose.by], isElbowFlipped(pose.be));
    const neck: Vec = [pose.nx, pose.ny];
    const hip: Vec = [pose.hx, pose.hy];
    const spine = segmentAngle(neck, hip);
    const back = isTurned(pose);
    const sign = isMirrored(pose) ? -1 : 1;
    const center = headCenter(pose);
    const [x, y] = atNeck(pose, ...(profile.headOffset ?? [0, 0]));
    const head: Vec = [center[0] + x - pose.nx, center[1] + y - pose.ny];
    const scarfAnchor = skin.scarfAt === "belt" ? atHip(pose, -2.5, -1.5) : atNeck(pose, -1.8, 0.5);
    const scarfAngle = hangingAngle(look.scarf, sign);
    const tailAngle = hangingAngle(look.tail, sign);
    const weaponHeight = (skin.blade.reach * PARTS.sword[3]) / (profile.weaponTipY - profile.weaponGrip[1]);
    const weaponDisplay = skin.bladeDisplay?.(pose.bs) ?? "drawn";
    const holster = atHip(pose, -2.4, -0.3);
    const holsterAngle = spine + 0.55;

    function drawGrip(anchor: Vec, angle: number): void {
      const [x, y, w, h] = PARTS.sword;
      const end = Math.min(h, profile.weaponGrip[1] + 7);
      drawRotatedPart(
        paint,
        [x, y, w, end],
        anchor,
        [profile.weaponWidth, (end / h) * weaponHeight],
        angle,
        profile.weaponGrip,
      );
    }

    function drawOffhand(anchor: Vec, angle: number, height: number): void {
      if (!offhand) {
        return;
      }
      const painter = createPartPainter(ctx, offhand);
      const width = height * (offhand.naturalWidth / offhand.naturalHeight);
      painter(
        [0, 0, offhand.naturalWidth, offhand.naturalHeight],
        anchor,
        [width, height],
        angle,
        profile.offhandAnchor ?? [0.5, 0.22],
      );
    }

    function arm(shoulder: Vec, joint: Vec, end: Vec): void {
      segment(paint, PARTS.upperArm, shoulder, joint, 4.25);
      segment(paint, PARTS.forearm, joint, end, 4.2);
    }

    function armed(): void {
      if (look.sword && weaponDisplay !== "sheathed") {
        ctx.save();
        ctx.filter = "none";
        const angle = pose.sa - Math.PI / 2;
        if (weaponDisplay === "heldSheathed") {
          drawOffhand(hand, angle, skin.blade.reach);
          drawGrip(hand, angle);
        } else {
          drawRotatedPart(paint, PARTS.sword, hand, [profile.weaponWidth, weaponHeight], angle, profile.weaponGrip);
        }
        ctx.restore();
      }
      arm(near, elbow, hand);
    }

    function free(): void {
      if (skin.offhand?.held) {
        drawOffhand(otherHand, pose.oa - Math.PI / 2, 12);
      }
      arm(far, farElbow, otherHand);
    }

    function leg(forward: boolean): void {
      const joint = atHip(pose, forward ? 1.5 : -1.5, 0);
      const foot: Vec = forward ? [pose.ffx, pose.ffy] : [pose.bfx, pose.bfy];
      const [knee, ankle] = legReach(joint, foot);
      segment(paint, PARTS.thigh, joint, knee, 4.25);
      segment(paint, PARTS.shin, knee, ankle, 3.8);
      drawRotatedPart(paint, PARTS.foot, ankle, [4.5, 3.25], forward ? pose.fa : pose.ba, [7.5, 7]);
    }

    ctx.save();
    ctx.scale(sign, 1);
    paint(PARTS.ponytail, [head[0] - (back ? 0.5 : 3.4), head[1] - 1], [7, 10], tailAngle, [0.5, 0.1]);
    paint(PARTS.scarfTail, scarfAnchor, [5.8, 12.3], scarfAngle, [0.5, 0.09]);
    ctx.filter = "brightness(72%)";
    (back ? armed : free)();
    leg(back);
    ctx.filter = "none";
    paint(PARTS.coat, atHip(pose, -1, -1.3), [8, 13], spine + look.flare * 0.08, [0.68, 0.12]);
    leg(!back);
    if (skin.offhand?.hip && weaponDisplay !== "heldSheathed") {
      drawOffhand(holster, holsterAngle, 14);
      if (look.sword && weaponDisplay === "sheathed") {
        drawGrip(holster, holsterAngle);
      }
    }
    paint(back ? PARTS.rearTorso : PARTS.torso, neck, [11.25, 12.5], spine, [0.52, 0.1]);
    paint(back ? PARTS.rearHead : PARTS.head, [head[0] - 0.5, head[1] - 1], [15, 14.4], spine * 0.55);
    paint(PARTS.scarfKnot, scarfAnchor, [6, 3.3], spine);
    (back ? free : armed)();
    ctx.restore();
    return [hand[0] * sign, hand[1]];
  };
}
