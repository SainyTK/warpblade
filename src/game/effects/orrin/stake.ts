import { STAKE_SHAPE } from "../../../constants/orrin/chainLook";
import { HERO_COLORS as HC, PAL } from "../../../constants/palette";
import { RES } from "../../../constants/stage";
import { toScreenX, toScreenY } from "../../../engine/frame";
import { drawTube, type Metal } from "./metalTube";

const BRASS: Metal = { rim: PAL.brass[0], shade: PAL.brass[2], body: PAL.brass[3], light: PAL.brass[5] };
const nodes = new Float32Array(6);

/** a stake driven into the floor at (x, y), `tall` pixels high: a steel shaft thickening toward a brass cap */
export function drawStake(x: number, y: number, tall: number = STAKE_SHAPE.tall, a = 1): void {
  const steel: Metal = { rim: HC.steelDeep, shade: HC.steelDark, body: HC.steel, light: HC.steelLight };
  const ix = toScreenX(x) * RES;
  const iy = toScreenY(y) * RES;
  const { foot, neck, cap } = STAKE_SHAPE;
  nodes[0] = ix;
  nodes[1] = iy;
  nodes[2] = foot * RES;
  nodes[3] = ix;
  nodes[4] = iy - tall * RES;
  nodes[5] = neck * RES;
  drawTube(nodes, 2, steel, a);
  nodes[0] = ix - cap * RES;
  nodes[1] = iy - tall * RES;
  nodes[2] = neck * RES * 0.7;
  nodes[3] = ix + cap * RES;
  drawTube(nodes, 2, BRASS, a);
}
