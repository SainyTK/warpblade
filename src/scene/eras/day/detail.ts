import { FN, FW, GROUND, H, RES, W } from "../../../constants/stage";
import type { Color } from "../../../types/color";
import type { Rng } from "../../../utils/rng";
import { scale2x } from "../../../utils/scale2x";
import { LAYER } from "../../plate";
import type { PlatePaint } from "../../platePaint";
import type { ScenePalette } from "../sceneDef";
import type { SkyColors } from "./colors";
import { paintFlora, type Stalk } from "./flora";
import { paintHills } from "./hills";
import { paintMasonry } from "./masonry";
import { openSky } from "./openSky";
import { paintSkyPicture } from "./sky";
import { paintTowers, towerSpans } from "./towers";

/** The day scene's fine detail, painted on the finished static picture: sky first, then far to near. */

/** what the art pixel picture tells the detail pass: the picture itself and where the tower windows are */
export interface DayArt {
  picture: Uint32Array;
  /** the art pixel at the top of each window */
  windows: readonly (readonly [number, number])[];
}

/**
 * Lay the sky picture where the sky shows: on every sky pixel, and on the corners of other pixels that the half steps
 * along slopes gave back to the sky.
 */
function showSky(paint: PlatePaint, sky: Uint32Array, art: Uint32Array, P: ScenePalette): void {
  const skyTones = new Set<Color>(P.sky);
  const stepped = scale2x(art, W, H);
  openSky.fill(0);
  for (let i = 0; i < FN; i++) {
    const ix = i % FW;
    const iy = (i - ix) / FW;
    if (iy >= GROUND * RES) break;
    if (paint.layerAt(ix, iy) !== LAYER.sky && !skyTones.has(stepped[i])) continue;
    paint.plate[i] = sky[i];
    openSky[i] = 1;
  }
}

/** paint the whole scene's detail and return the stalks left to sway each frame */
export function paintDayDetail(
  paint: PlatePaint,
  r: Rng,
  k: number,
  C: SkyColors,
  P: ScenePalette,
  art: DayArt,
): Stalk[] {
  const sky = paintSkyPicture(r, k, C, P);
  showSky(paint, sky, art.picture, P);
  paintHills(paint, r, P);
  paintTowers(paint, r, P, sky, art.windows);
  paintMasonry(paint, r, P);
  return paintFlora(paint, r, P, towerSpans(paint));
}
