import { FW, GROUND, RES, W } from "../../../constants/stage";
import type { Color } from "../../../types/color";
import { mix, scale } from "../../../utils/color";
import type { Rng } from "../../../utils/rng";
import { LAYER } from "../../plate";
import type { PlatePaint } from "../../platePaint";
import { ridgeTopAt } from "../../terrain";
import type { ScenePalette } from "../sceneDef";
import { smoothNoise } from "./noise";
import { openSky } from "./openSky";
import { putSolid, stepBlend } from "./plateTools";

/** The green ridge at image pixel detail: sunlit crests, a nearer hill in front, and far woods along both crests. */

const ONLY_RIDGE = [LAYER.ridge] as const;
const SKY_OR_RIDGE = [LAYER.sky, LAYER.ridge] as const;
/** the crest of the nearer hill at art column x */
const nearCrest = (x: number): number => 135 + Math.sin(x * 0.033 + 0.8) * 6 + Math.sin(x * 0.09) * 2.5;
/** the sunlit band under a crest, in art pixels, and how strongly it shows */
const CREST = { depth: 4, light: 0.42 };
/** how much darker the nearer hill is, and how strongly its slopes facing the sun and away from it differ */
const NEAR = { tone: 0.87, cover: 0.62, slope: 0.14 };
/** far woods: how wide a wood is in art pixels, and a tree's radius */
const WOODS = { patch: 22, share: 0.52, small: 0.9, large: 1.9 };
/** a tree's crown next to the hill it stands on: its shaded side, its body, and how much sun its lit side takes */
const TREE = { dark: 0.8, mid: 0.9, lit: 0.5 };

function shapeHills(paint: PlatePaint, P: ScenePalette): void {
  const nearTone = scale(P.ridge, NEAR.tone);
  for (let iy = 0; iy < GROUND * RES; iy++)
    for (let ix = 0; ix < FW; ix++) {
      if (paint.layerAt(ix, iy) !== LAYER.ridge || openSky[iy * FW + ix]) continue;
      const x = (ix + 0.5) / RES;
      const y = (iy + 0.5) / RES;
      const column = Math.floor(x);
      const depth = y - ridgeTopAt(column);
      const facesSun = ridgeTopAt(column + 3) > ridgeTopAt(column - 3);
      if (depth >= 1 && depth < CREST.depth)
        stepBlend(paint, ix, iy, P.ridgeTop, (1 - (depth - 1) / (CREST.depth - 1)) * CREST.light, 3);
      else if (!facesSun) stepBlend(paint, ix, iy, nearTone, NEAR.slope, 2);
      const over = y - nearCrest(x);
      if (over < 0) continue;
      paint.blend(ix, iy, nearTone, NEAR.cover);
      if (over < 0.5) paint.blend(ix, iy, P.ridgeTop, CREST.light);
      else if (over < CREST.depth) stepBlend(paint, ix, iy, P.ridgeTop, (1 - over / CREST.depth) * 0.3, 3);
    }
}

/** one far tree: a round crown lit on its upper right, standing on a crest */
function tree(paint: PlatePaint, cx: number, cy: number, radius: number, base: Color, lit: Color): void {
  const dark = scale(base, TREE.dark);
  const mid = scale(base, TREE.mid);
  const reach = Math.ceil(radius * RES);
  for (let v = -reach; v <= reach; v++)
    for (let u = -reach; u <= reach; u++) {
      const dx = (u + 0.5) / RES / radius;
      const dy = (v + 0.5) / RES / radius;
      if (dx * dx + dy * dy > 1) continue;
      const light = dx - dy;
      putSolid(
        paint,
        Math.floor(cx * RES) + u,
        Math.floor(cy * RES) + v,
        light > 0.3 ? lit : light < -0.5 ? dark : mid,
        SKY_OR_RIDGE,
      );
    }
}

function woods(paint: PlatePaint, r: Rng, P: ScenePalette, crest: (x: number) => number, size: number): void {
  // from the right, so each crown's sunlit side stays in front of the one behind it
  for (let x = W - 1; x >= 0; x--) {
    const share = smoothNoise(x + size * 100, 0, WOODS.patch);
    if (share < WOODS.share || !r.chance((share - WOODS.share) * 1.7)) continue;
    const radius = r.range(WOODS.small, WOODS.large) * size;
    const cx = x + r.next();
    const cy = crest(cx);
    const ground = paint.get(Math.floor(cx * RES), Math.min(GROUND * RES - 1, Math.floor((cy + 2.5) * RES)));
    if (!paint.on(Math.floor(cx * RES), Math.floor((cy + 2.5) * RES), ONLY_RIDGE)) continue;
    tree(paint, cx, cy - radius * 0.45, radius, ground, mix(ground, P.ridgeTop, TREE.lit));
  }
}

export function paintHills(paint: PlatePaint, r: Rng, P: ScenePalette): void {
  shapeHills(paint, P);
  woods(paint, r, P, (x) => ridgeTopAt(Math.floor(x)), 1);
  woods(paint, r, P, nearCrest, 1.3);
}
