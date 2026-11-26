import type { SpriteImage } from "../types/sprite";
import type { FoeArtSheet } from "./types";

const OPAQUE = 128;
const NEAR_BLACK = 0x010101;

export async function decodeSheet(url: string, sheet: FoeArtSheet): Promise<SpriteImage[]> {
  const image = new Image();
  image.src = url;
  await image.decode();
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  ctx.drawImage(image, 0, 0);
  return sheet.frames.map(([x, y, w, h, originX, originY]) => {
    const pixels = ctx.getImageData(x, y, w, h).data;
    const d = new Uint32Array(w * h);
    for (let i = 0; i < w * h; i++) {
      if (pixels[i * 4 + 3] < OPAQUE) continue;
      const c = (pixels[i * 4] << 16) | (pixels[i * 4 + 1] << 8) | pixels[i * 4 + 2];
      d[i] = c || NEAR_BLACK;
    }
    return {
      w,
      h,
      ox: originX,
      oy: originY,
      res: sheet.imagePixelsPerArtPixel,
      d,
      box: { x0: 0, y0: 0, x1: w - 1, y1: h - 1 },
    };
  });
}
