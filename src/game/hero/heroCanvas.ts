import { SpriteCanvas } from "../../engine/sprite";

/** heroes are drawn at two image pixels per art pixel: their head art and fine details are made for it */
export const HERO_RES = 2;

/** a canvas for the hero rig, sized in art pixels with its feet at (ox, oy) */
export const heroCanvas = (w: number, h: number, ox: number, oy: number): SpriteCanvas =>
  new SpriteCanvas(w * HERO_RES, h * HERO_RES, ox * HERO_RES, oy * HERO_RES, HERO_RES);
