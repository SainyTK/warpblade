import type { SpriteCanvas } from "../engine/sprite";
import type { Pose } from "./pose";

export type Vec = [number, number];

/**
 * One frame of the shared rig as the hero's own drawing reads it, in pixels from the feet, facing right. Everything a
 * hero draws on the rig is drawn from this and from `HERO_COLORS`, never from game state, so the same drawing serves
 * the stage, the hero screen portrait and the afterimages.
 */
export interface RigFrame {
  pose: Pose;
  /** the pose turns the hero's back to the camera */
  back: boolean;
  nearShoulder: Vec;
  nearElbow: Vec;
  /** the hand that holds the sword */
  nearHand: Vec;
  farShoulder: Vec;
  farElbow: Vec;
  /** the off hand */
  farHand: Vec;
  /** the scarf's and the ponytail's rope points, from where they hang to their ends */
  scarf: readonly Vec[];
  tail: readonly Vec[];
  /** how far the coat tails fly back */
  flare: number;
  /** the sword is in the hand; false while it flies in a warp */
  armed: boolean;
}

/** the sword a hero holds: every hero's weapon is a sword, each with its own drawing */
export interface BladeLook {
  /** from the hand to the tip, in pixels: sword trails and afterimages follow it */
  reach: number;
  /**
   * Draw the sword held in `hand`, pointing along `angle` (radians, the pose's `sa`). `state` is the pose's `bs`, the
   * hero's own blade state for a sword that changes (a katana half drawn, an open chamber): 0 unless the hero's clips
   * set it, and 0 for the sword thrown in a warp. The same drawing serves the hand, the thrown sword and the portrait.
   */
  draw(s: SpriteCanvas, hand: Vec, angle: number, state: number): void;
}

/** an item that belongs to a sword style, carried besides the sword: a shield, a short sword, a scabbard */
export interface OffhandLook {
  /**
   * Draw the item held in the far hand, pointing along `angle` (radians, the pose's `oa`); it is drawn with the far
   * arm, under its hand. `front` is true when the far arm is in front of the body (a turned back).
   */
  held?(s: SpriteCanvas, hand: Vec, angle: number, front: boolean, rig: RigFrame): void;
  /** draw the item worn at the hip, over the legs and coat tails and under the torso and belt */
  hip?(s: SpriteCanvas, rig: RigFrame): void;
}

/**
 * Where an extra piece is drawn among the rig's parts, back to front: `behind` everything (after the scarf and
 * ponytail), `underTorso` over the legs and coat tails, `overTorso` under the head, `overHead` under the front arm, and
 * `front` over everything.
 */
export type RigLayer = "behind" | "underTorso" | "overTorso" | "overHead" | "front";

/** a piece of the hero's look that the shared parts do not have: a cape, a pauldron, a hat, a tassel */
export interface RigExtra {
  layer: RigLayer;
  draw(s: SpriteCanvas, rig: RigFrame): void;
}

/**
 * The shared rig's parts. A hero's look may replace any of them with its own drawing (`HeroSkin.parts`); a part left
 * out keeps the shared drawing in the hero's colours.
 */
export interface RigParts {
  /** the ponytail and the scarf along their ropes, behind everything else */
  trails(s: SpriteCanvas, rig: RigFrame): void;
  /** one arm from shoulder to hand; `front` is true for the arm in front of the body */
  arm(s: SpriteCanvas, shoulder: Vec, elbow: Vec, hand: Vec, front: boolean, rig: RigFrame): void;
  /** one leg from its hip to its foot, the toes tilted by `toe` radians; `far` is true for the leg behind */
  leg(s: SpriteCanvas, hip: Vec, foot: Vec, toe: number, far: boolean, rig: RigFrame): void;
  /** the coat below the belt */
  coatTails(s: SpriteCanvas, rig: RigFrame): void;
  /** the torso from neck to hip, with its belt */
  torso(s: SpriteCanvas, rig: RigFrame): void;
  /** the head from its pixel rows, and whatever sits at the neck */
  head(s: SpriteCanvas, rig: RigFrame): void;
}
