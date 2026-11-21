import type { SpriteCanvas } from "../engine/sprite";
import type { HeroSkin } from "../types/character";
import type { Pose } from "../types/pose";
import type { Vec } from "../types/rig";
import type { HeroLook } from "./drawHero";

export type HeroArtPainter = (canvas: SpriteCanvas, pose: Pose, look: HeroLook) => Vec;

const painters = new WeakMap<HeroSkin, HeroArtPainter>();

export function registerHeroArt(skin: HeroSkin, painter: HeroArtPainter): void {
  painters.set(skin, painter);
}

export function alternateHeroArt(skin: HeroSkin): HeroArtPainter | undefined {
  return painters.get(skin);
}
