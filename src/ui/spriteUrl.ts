import type { SpriteCanvas } from "../engine/sprite";

/** a sprite canvas as a PNG data URL, for pixel images in the page */
export function spriteUrl(s: SpriteCanvas): string {
  const out = document.createElement("canvas");
  out.width = s.w;
  out.height = s.h;
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("This browser cannot draw to a 2D canvas.");
  const img = ctx.createImageData(s.w, s.h);
  s.d.forEach((c, i) => {
    if (!c) return;
    img.data.set([(c >> 16) & 255, (c >> 8) & 255, c & 255, 255], i * 4);
  });
  ctx.putImageData(img, 0, 0);
  return out.toDataURL();
}
