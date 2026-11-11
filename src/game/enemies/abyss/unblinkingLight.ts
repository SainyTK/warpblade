import type { SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";
import { mix } from "../../../utils/color";

/** how far the second rim pixel and the sun-side edge take the rim colour */
const RIM = { fade: 0.45, side: 0.5 } as const;

/**
 * The black sun's light on The Unblinking's finished hide, in one pass over the mirrored canvas (unblinkingMirror.ts):
 * the top edge of every shape takes the rim colour, hot on the half toward the sun and soft on the far half, the image
 * pixel row under it fades into the hide, and edges that face the sun take a softer rim.
 */
export function blackSunRim(s: SpriteCanvas, hot: Color, soft: Color): void {
  const { w, d, box } = s;
  for (let y = Math.max(2, box.y0); y <= box.y1; y++) {
    const row = y * w;
    for (let x = Math.max(1, box.x0); x <= box.x1; x++) {
      const i = row + x;
      if (!d[i]) continue;
      // the canvas is shown mirrored, so its left half is the side toward the sun
      const sunward = x < s.ox;
      if (!d[i - w]) d[i] = sunward ? hot : soft;
      else if (!d[i - 2 * w]) d[i] = mix(d[i], sunward ? hot : soft, RIM.fade);
      else if (sunward && !d[i - 1]) d[i] = mix(d[i], soft, RIM.side);
    }
  }
}
