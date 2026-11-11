import { HOOK_EYE, HOOK_SHAPE, WEIGHT_SHAPE } from "../../../constants/orrin/chainLook";
import { HERO_COLORS as HC, PAL } from "../../../constants/palette";
import { RES } from "../../../constants/stage";
import { putImage, toScreenX, toScreenY } from "../../../engine/frame";
import { TAU } from "../../../utils/math";
import { drawTube, type Metal } from "./metalTube";

const BRASS: Metal = { rim: PAL.brass[0], shade: PAL.brass[2], body: PAL.brass[3], light: PAL.brass[4] };
const GLINT = PAL.brass[5];

const nodes = new Float32Array(HOOK_SHAPE.length * 3);
const spike = new Float32Array(6);

/**
 * The hook head at the chain's end, at image pixel detail: a brass sickle whose shank runs on along the chain (`ux`,
 * `uy`), curling back on the side `side` (1 or -1) to a point, with an eye at its root and a glint on the curl.
 */
export function drawHookHead(x: number, y: number, ux: number, uy: number, side: number, a = 1): void {
  const ix = toScreenX(x) * RES;
  const iy = toScreenY(y) * RES;
  const nx = -uy * side;
  const ny = ux * side;
  HOOK_SHAPE.forEach(([along, across, r], i) => {
    nodes[i * 3] = ix + (ux * along + nx * across) * RES;
    nodes[i * 3 + 1] = iy + (uy * along + ny * across) * RES;
    nodes[i * 3 + 2] = r * RES;
  });
  drawTube(nodes, HOOK_SHAPE.length, BRASS, a);
  spike[0] = ix;
  spike[1] = iy;
  spike[2] = HOOK_EYE * RES;
  drawTube(spike, 1, BRASS, a);
  putImage(Math.floor(ix), Math.floor(iy), PAL.brass[0], a);
  const [gx, gy] = HOOK_SHAPE[3];
  putImage(Math.floor(ix + (ux * gx + nx * gy) * RES), Math.floor(iy + (uy * gx + ny * gy) * RES - 1), GLINT, a);
}

/** Iron Weight's head: a ball of dark steel lit from above, ringed with short spikes, with a glint on its crown */
export function drawWeightHead(x: number, y: number, a = 1): void {
  const steel: Metal = { rim: HC.steelDeep, shade: HC.steelDark, body: HC.steel, light: HC.steelLight };
  const ix = toScreenX(x) * RES;
  const iy = toScreenY(y) * RES;
  const { radius, spike: out, spikes } = WEIGHT_SHAPE;
  for (let k = 0; k < spikes; k++) {
    const g = (k / spikes) * TAU;
    spike[0] = ix + Math.cos(g) * (radius - 0.5) * RES;
    spike[1] = iy + Math.sin(g) * (radius - 0.5) * RES;
    spike[2] = 1.1;
    spike[3] = ix + Math.cos(g) * (radius + out) * RES;
    spike[4] = iy + Math.sin(g) * (radius + out) * RES;
    spike[5] = 0.2;
    drawTube(spike, 2, steel, a);
  }
  spike[0] = ix;
  spike[1] = iy;
  spike[2] = radius * RES;
  drawTube(spike, 1, steel, a);
  putImage(Math.floor(ix - radius * 0.7), Math.floor(iy - radius), HC.steelGlint, a);
  putImage(Math.floor(ix - radius * 0.7) + 1, Math.floor(iy - radius), HC.steelGlint, a);
}
