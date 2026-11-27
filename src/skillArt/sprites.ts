import spritesJson from "./assets/sprites.json";
import atlasUrl from "./assets/sprites.webp?url";
import type { ArtSprite, SpriteSheet } from "./types";

const sheet: SpriteSheet = spritesJson;
const sprites = new Map<string, ArtSprite>();
const urls = new Map<string, string>();
const OPAQUE = 128;
const NEAR_BLACK = 0x010101;

function cut(pixels: ImageData, [x, y, w, h]: readonly number[]): ArtSprite {
  const colors = new Uint32Array(w * h);
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const at = ((y + j) * pixels.width + x + i) * 4;
      const [r, g, b, a] = pixels.data.subarray(at, at + 4);
      if (a >= OPAQUE) colors[j * w + i] = (r << 16) | (g << 8) | b || NEAR_BLACK;
    }
  }
  return { w, h, colors };
}

export async function loadSprites(): Promise<void> {
  try {
    const image = new Image();
    image.src = atlasUrl;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.drawImage(image, 0, 0);
    const pixels = ctx.getImageData(0, 0, image.width, image.height);
    for (const [id, rect] of Object.entries(sheet.sprites)) sprites.set(id, cut(pixels, rect));
  } catch {
    sprites.clear();
  }
}

export function spriteArt(id: string, w: number, h: number): ArtSprite | undefined {
  const art = sprites.get(id);
  return art && art.w === w && art.h === h ? art : undefined;
}

export function spriteArtUrl(id: string): string | undefined {
  const hit = urls.get(id);
  if (hit) return hit;
  const art = sprites.get(id);
  if (!art) return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = art.w;
  canvas.height = art.h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;
  const image = ctx.createImageData(art.w, art.h);
  art.colors.forEach((c, i) => {
    if (c) image.data.set([(c >> 16) & 255, (c >> 8) & 255, c & 255, 255], i * 4);
  });
  ctx.putImageData(image, 0, 0);
  const url = canvas.toDataURL();
  urls.set(id, url);
  return url;
}
