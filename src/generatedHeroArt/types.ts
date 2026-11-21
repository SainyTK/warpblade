import type { HeroLook } from "../rig";
import type { HeroSkin } from "../types/character";
import type { Pose } from "../types/pose";
import type { Vec } from "../types/rig";

export type GeneratedHeroArt = (ctx: CanvasRenderingContext2D, pose: Pose, look: HeroLook, skin: HeroSkin) => Vec;

export interface SpriteProfile {
  weaponGrip: Vec;
  weaponTipY: number;
  weaponWidth: number;
  offhandAnchor?: Vec;
  headOffset?: Vec;
}
