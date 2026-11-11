import { H, W } from "../../../constants/stage";
import { fleck, glow, place, px } from "../../../engine/frame";
import { ASH, EMBER, EMBER_GLOW } from "./colors";

/** each frame: ash and embers drift up toward the rift, a few more each wave */
export function drawAsh(t: number, k: number): void {
  place();
  const n = 24 + Math.round(k * 22);
  for (let i = 0; i < n; i++) {
    const speed = 7 + ((i * 7) % 11);
    const y = H + 8 - ((t * speed + i * 53) % (H + 16));
    const x = (((i * 67) % W) + Math.sin(t * 0.5 + i * 1.9) * 7 + t * 2) % W;
    if (i % 4 === 0) {
      // an ember flares and dims as it rises, a fine dying tail under it
      const c = EMBER[i % 3];
      const b = 0.55 + 0.45 * Math.sin(t * 3 + i);
      px(x, y, c, b);
      fleck(x + 0.25, y + 1.25, EMBER[2], b * 0.8);
      glow(x, y, 4, EMBER_GLOW, 0.18 * b);
    } else if (i % 4 === 1) {
      px(x, y, ASH[i % 3], 0.75);
    } else {
      // the finest ash is half an art pixel and turns over as it drifts
      fleck(x, y, ASH[i % 3], 0.6 + 0.4 * Math.sin(t * 2 + i));
    }
  }
}
