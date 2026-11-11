/**
 * Double an image with the Scale2x (EPX) rule: each pixel becomes four, and a corner takes its two neighbours' colour
 * when they agree, so stairs along a slope or a curve get a half step while flat areas and straight edges stay as they were.
 */
export function scale2x(src: Uint32Array, w: number, h: number): Uint32Array {
  const out = new Uint32Array(w * h * 4);
  const ow = w * 2;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const p = src[i];
      const up = y > 0 ? src[i - w] : p;
      const down = y < h - 1 ? src[i + w] : p;
      const left = x > 0 ? src[i - 1] : p;
      const right = x < w - 1 ? src[i + 1] : p;
      const o = y * 2 * ow + x * 2;
      out[o] = left === up && left !== down && up !== right ? up : p;
      out[o + 1] = up === right && up !== left && right !== down ? right : p;
      out[o + ow] = down === left && down !== right && left !== up ? left : p;
      out[o + ow + 1] = right === down && right !== up && down !== left ? down : p;
    }
  return out;
}
