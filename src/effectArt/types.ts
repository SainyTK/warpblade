import type { EFFECT_HEROES, EFFECT_SLOTS } from "./constants";

export type EffectHero = (typeof EFFECT_HEROES)[number];

export type EffectSlot = (typeof EFFECT_SLOTS)[number];

export type EffectFrame = readonly [x: number, y: number, w: number, h: number];

export interface EffectAtlasSlot {
  frames: readonly EffectFrame[];
  fps: number;
}

export interface EffectAtlasMap {
  slots: Readonly<Record<EffectSlot, EffectAtlasSlot>>;
}

export interface EffectSprite extends EffectAtlasSlot {
  image: HTMLImageElement;
}

export type EffectBlend = "normal" | "additive";

export interface EffectDrawOptions {
  frame?: number;
  scale?: number;
  rotation?: number;
  alpha?: number;
  blend?: EffectBlend;
  flip?: boolean;
}
