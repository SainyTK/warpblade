import type { SpriteCanvas } from "../engine/sprite";
import type { HeroArtPainter } from "../rig";
import type { HeroSkin } from "../types/character";
import { outlineHeroSprite } from "./sprite";
import type { GeneratedHeroArt } from "./types";

const ALPHA = 96;
const contexts = new WeakMap<SpriteCanvas, CanvasRenderingContext2D>();

function spriteContext(sprite: SpriteCanvas): CanvasRenderingContext2D {
  const existing = contexts.get(sprite);
  if (existing) {
    return existing;
  }
  const canvas = document.createElement("canvas");
  canvas.width = sprite.w;
  canvas.height = sprite.h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    throw new Error("Generated hero art needs a 2D context");
  }
  contexts.set(sprite, ctx);
  return ctx;
}

export function createGeneratedPainter(skin: HeroSkin, art: GeneratedHeroArt): HeroArtPainter {
  return (sprite, pose, look) => {
    const { w, h, ox, oy, res } = sprite;
    const ctx = spriteContext(sprite);
    ctx.clearRect(0, 0, w, h);
    ctx.setTransform(res, 0, 0, res, ox, oy);
    const hand = art(ctx, pose, look, skin);
    ctx.resetTransform();
    const pixels = ctx.getImageData(0, 0, w, h);
    outlineHeroSprite(pixels);
    sprite.clear();
    sprite.begin();
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const rgba = pixels.data;
        if (rgba[i + 3] >= ALPHA) {
          const rgb = (rgba[i] << 16) | (rgba[i + 1] << 8) | rgba[i + 2];
          sprite.set((x - ox) / res, (y - oy) / res, rgb || 0x010101);
        }
      }
    }
    sprite.commit(false);
    return hand;
  };
}
