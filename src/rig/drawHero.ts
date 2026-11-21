import { HERO_COLORS as HC } from "../constants/palette";
import type { SpriteCanvas } from "../engine/sprite";
import type { HeroSkin } from "../types/character";
import type { Pose } from "../types/pose";
import type { RigFrame, RigLayer, RigParts, Vec } from "../types/rig";
import { atHip, farShoulder, isElbowFlipped, isMirrored, isTurned, nearShoulder } from "../utils/poseFrame";
import { alternateHeroArt } from "./alternateArt";
import { armReach, drawArm } from "./arm";
import { drawCoatTails } from "./coatTails";
import { drawHead } from "./head";
import { drawLeg } from "./leg";
import { drawTorso } from "./torso";
import { drawTrails } from "./trails";

/** what the hero sprite needs besides the pose and the skin */
export interface HeroLook {
  /** scarf and ponytail points, local pixels from the feet */
  scarf: Vec[];
  tail: Vec[];
  /** how far the coat tails fly back */
  flare: number;
  /** the sword is in the hand */
  sword: boolean;
  turnLegs?: boolean;
}

/** the shared parts: Kael's first look, in the colours of whoever wears them */
const sharedParts = (skin: HeroSkin): RigParts => ({
  trails: (s, rig) => drawTrails(s, rig.tail, rig.scarf, skin.scarfAt === "belt"),
  arm: (s, shoulder, elbow, hand, front) => drawArm(s, shoulder, elbow, hand, front),
  leg: (s, hip, foot, toe, far) => drawLeg(s, hip, foot, toe, far),
  coatTails: (s, rig) => drawCoatTails(s, rig.pose, rig.flare),
  torso: (s, rig) => drawTorso(s, rig.pose, rig.back),
  head: (s, rig) => drawHead(s, rig.pose, rig.back, rig.back ? skin.headBack : skin.head),
});

/**
 * Draw a hero into the canvas, back to front, from a pose and a skin. Facing the camera the sword arm is in front of
 * the body; with the back turned it swings behind it. A mirrored pose is drawn as authored, then flipped. The hero's
 * own parts replace the shared ones, its extras go in at their layers, and its sword and off-hand item are its own
 * drawing. Returns where the near hand ended up, as drawn.
 */
export function drawHero(s: SpriteCanvas, p: Pose, skin: HeroSkin, look: HeroLook): Vec {
  const alternate = alternateHeroArt(skin);
  if (alternate) {
    return alternate(s, p, look);
  }
  const back = isTurned(p);
  const mirrored = isMirrored(p);
  const flip = (q: Vec): Vec => [-q[0], q[1]];
  const near = nearShoulder(p);
  const far = farShoulder(p);
  const [elbow, hand] = armReach(near, [p.fx, p.fy], isElbowFlipped(p.fe));
  const [farElbow, farHand] = armReach(far, [p.bx, p.by], isElbowFlipped(p.be));
  const rig: RigFrame = {
    pose: p,
    back,
    nearShoulder: near,
    nearElbow: elbow,
    nearHand: hand,
    farShoulder: far,
    farElbow,
    farHand,
    scarf: mirrored ? look.scarf.map(flip) : look.scarf,
    tail: mirrored ? look.tail.map(flip) : look.tail,
    flare: look.flare,
    armed: look.sword,
  };
  const parts: RigParts = { ...sharedParts(skin), ...skin.parts };
  const extras = (layer: RigLayer) => {
    for (const extra of skin.extras ?? []) if (extra.layer === layer) extra.draw(s, rig);
  };
  const swordArm = () => {
    if (look.sword) skin.blade.draw(s, hand, p.sa, p.bs);
    parts.arm(s, near, elbow, hand, !back, rig);
  };
  const farArm = (front: boolean) => {
    skin.offhand?.held?.(s, farHand, p.oa, front, rig);
    parts.arm(s, far, farElbow, farHand, front, rig);
  };
  s.clear();
  parts.trails(s, rig);
  extras("behind");
  if (back) swordArm();
  else farArm(false);
  const reverseLegs = back && look.turnLegs;
  const forwardLeg = (behind: boolean) => parts.leg(s, atHip(p, 1.5, 0), [p.ffx, p.ffy], p.fa, behind, rig);
  const trailingLeg = (behind: boolean) => parts.leg(s, atHip(p, -1.5, 0), [p.bfx, p.bfy], p.ba, behind, rig);
  (reverseLegs ? forwardLeg : trailingLeg)(true);
  parts.coatTails(s, rig);
  (reverseLegs ? trailingLeg : forwardLeg)(false);
  skin.offhand?.hip?.(s, rig);
  extras("underTorso");
  parts.torso(s, rig);
  extras("overTorso");
  parts.head(s, rig);
  extras("overHead");
  if (back) farArm(true);
  else swordArm();
  extras("front");
  s.outline(HC.outline);
  if (!mirrored) return hand;
  s.mirror();
  return flip(hand);
}
