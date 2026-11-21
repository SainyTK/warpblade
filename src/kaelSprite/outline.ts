import { HERO_COLORS } from "../constants/palette";
import { cb, cg, cr } from "../utils/color";

const EDGE_ALPHA = 96;

export function outlineKaelSprite(image: ImageData): void {
  const { data, width, height } = image;
  const coverage = new Uint8Array(width * height);
  for (let pixel = 0; pixel < coverage.length; pixel++) {
    coverage[pixel] = data[pixel * 4 + 3] >= EDGE_ALPHA ? 1 : 0;
  }
  const color = HERO_COLORS.outline;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const pixel = y * width + x;
      if (
        coverage[pixel] ||
        !(coverage[pixel - 1] || coverage[pixel + 1] || coverage[pixel - width] || coverage[pixel + width])
      ) {
        continue;
      }
      data[pixel * 4] = cr(color);
      data[pixel * 4 + 1] = cg(color);
      data[pixel * 4 + 2] = cb(color);
      data[pixel * 4 + 3] = 225;
    }
  }
}
