export interface EffectPixels {
  width: number;
  data: Uint8ClampedArray;
}

const cache = new WeakMap<HTMLImageElement, EffectPixels>();

export function effectPixels(image: HTMLImageElement): EffectPixels | undefined {
  const cached = cache.get(image);
  if (cached) {
    return cached;
  }
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx || !canvas.width) {
    return undefined;
  }
  ctx.drawImage(image, 0, 0);
  const pixels = { width: canvas.width, data: ctx.getImageData(0, 0, canvas.width, canvas.height).data };
  cache.set(image, pixels);
  return pixels;
}
