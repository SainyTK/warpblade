import { ANCHOR_SHAPE as A } from "../../../constants/orrin/chainLook";
import { HERO_COLORS as HC, PAL } from "../../../constants/palette";
import { RES } from "../../../constants/stage";
import { toScreenX, toScreenY } from "../../../engine/frame";
import { drawTube, type Metal } from "./metalTube";

const BRASS: Metal = { rim: PAL.brass[0], shade: PAL.brass[2], body: PAL.brass[3], light: PAL.brass[5] };
/** the flukes' curve from one tip, down through the crown and up to the other, is traced in this many steps */
const FLUKE_STEPS = 8;
const bar = new Float32Array(6);
const flukes = new Float32Array((FLUKE_STEPS + 1) * 3);

/**
 * Anchor Fall's anchor with its crown at (x, y), at full detail: an iron shank, a stock across it, two flukes curving
 * up from the crown to sharp tips, all lit from above, and a brass ring at its top where the chain holds it.
 */
export function drawAnchor(x: number, y: number): void {
  const iron: Metal = { rim: HC.steelDeep, shade: HC.steelDark, body: HC.steel, light: HC.steelLight };
  const ix = toScreenX(x) * RES;
  const iy = toScreenY(y) * RES;
  for (let i = 0; i <= FLUKE_STEPS; i++) {
    const u = (i / FLUKE_STEPS) * 2 - 1;
    flukes[i * 3] = ix + u * A.fluke * RES;
    flukes[i * 3 + 1] = iy - u * u * A.flukeRise * RES;
    flukes[i * 3 + 2] = (0.35 + (1 - Math.abs(u)) * 0.7) * RES;
  }
  drawTube(flukes, FLUKE_STEPS + 1, iron);
  bar[0] = ix;
  bar[1] = iy;
  bar[2] = A.shank * RES;
  bar[3] = ix;
  bar[4] = iy - (A.tall - A.ring) * RES;
  bar[5] = A.shank * 0.8 * RES;
  drawTube(bar, 2, iron);
  bar[0] = ix - A.stockHalf * RES;
  bar[1] = iy - A.stock * RES;
  bar[2] = A.shank * 0.75 * RES;
  bar[3] = ix + A.stockHalf * RES;
  bar[4] = bar[1];
  drawTube(bar, 2, iron);
  bar[0] = ix;
  bar[1] = iy - A.tall * RES;
  bar[2] = A.ring * RES;
  drawTube(bar, 1, BRASS);
}
