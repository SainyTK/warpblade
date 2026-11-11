import { FN, FW, GROUND, H, PLATFORMS, RES, W } from "../constants/stage";
import { bayerAt } from "../engine/frame";
import type { Color } from "../types/color";
import { mix, scale } from "../utils/color";
import { smooth } from "../utils/math";
import { scale2x } from "../utils/scale2x";
import type { ScenePalette } from "./eras/sceneDef";
import { floorBlockTone, stoneTone } from "./stoneTone";
import { skyBandAt } from "./terrain";

/** what each art pixel of the static scene belongs to, from far to near */
export const LAYER = { sky: 0, celestial: 1, ridge: 2, tower: 3, ground: 4, slab: 5, prop: 6 } as const;
export type Layer = (typeof LAYER)[keyof typeof LAYER];
/** set on an art pixel the era's own decoration painted, which keeps the layer underneath */
export const DECORATED = 0x80;
export const LAYER_MASK = 0x7f;

/** how far the far ridge and the towers fade into the horizon's color, most at their feet, in dithered bands */
const HAZE = { ridge: 0.34, tower: 0.24, bands: 4, towerTop: 44, ridgeTop: 100 };
/** stone texture strength on the towers and the ridge, which are far off, next to 1 for the floor and slabs */
const FAR_TEXTURE = 0.45;
/** a slab is one block every this many art pixels, as its mortar lines are drawn */
const SLAB_BLOCK = 12;
const SLAB_BLOCK_DEPTH = 0.08;

function slabBlockTone(x: number, y: number): number {
  const slab = PLATFORMS.find((p) => y >= p.y && y < p.y + 9 && x >= p.x0 && x <= p.x1);
  if (!slab) return 1;
  const block = Math.floor((x - slab.x0) / SLAB_BLOCK);
  return 1 + (((block * 7 + slab.y * 3) % 5) / 4 - 0.5) * SLAB_BLOCK_DEPTH;
}

/**
 * The static scene at the frame's full detail, from the art pixel picture and its layer map: slopes and curves get
 * half steps, the open sky is dithered at the finer grid, the far layers fade toward the horizon, and stone gets
 * weathering, grain and block by block variation.
 */
export function developPlate(art: Uint32Array, layers: Uint8Array, P: ScenePalette): Uint32Array {
  const plate = scale2x(art, W, H);
  const skyTones = new Set<Color>(P.sky);
  const keepsLight = new Set<Color>([P.windowLit, P.windowLow]);
  const horizon = P.sky[P.sky.length - 1];
  for (let i = 0; i < FN; i++) {
    const ix = i % FW;
    const iy = (i - ix) / FW;
    const x = (ix / RES) | 0;
    const y = (iy / RES) | 0;
    const a = y * W + x;
    const layer = layers[a] & LAYER_MASK;
    const decorated = (layers[a] & DECORATED) !== 0;
    if (layer === LAYER.sky) {
      if (!decorated && skyTones.has(art[a])) plate[i] = skyBandAt((iy + 0.5) / RES, bayerAt(ix, iy), P);
      continue;
    }
    if (layer === LAYER.ridge || layer === LAYER.tower) {
      if (keepsLight.has(art[a])) continue;
      const ridge = layer === LAYER.ridge;
      const depth = ridge ? 0.4 + 0.6 * smooth(HAZE.ridgeTop, GROUND, y) : smooth(HAZE.towerTop, GROUND, y);
      const band = Math.floor(depth * HAZE.bands + bayerAt(ix, iy)) / HAZE.bands;
      const textured = scale(plate[i], stoneTone(ix, iy, FAR_TEXTURE, false));
      plate[i] = mix(textured, horizon, band * (ridge ? HAZE.ridge : HAZE.tower));
      continue;
    }
    if (decorated) continue;
    if (layer === LAYER.ground) plate[i] = scale(plate[i], stoneTone(ix, iy) * floorBlockTone(x, y));
    else if (layer === LAYER.slab) plate[i] = scale(plate[i], stoneTone(ix, iy) * slabBlockTone(x, y));
  }
  return plate;
}
