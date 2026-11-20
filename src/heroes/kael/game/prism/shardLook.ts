import { PAL } from "../../../../constants/palette";
import { fleck, glow, hairline, polygon } from "../../../../engine/frame";
import { enemyCenter } from "../../../../game/enemies/enemy";
import type { Enemy } from "../../../../types/enemy";
import type { Vec } from "../../../../types/rig";
import { WHITE } from "../../../../utils/color";
import { SHARD_LOOK } from "../../constants/prism";

const P = PAL.prism;

/** where each of `count` shards sits on a foe: in a row across its chest */
export function shardSpots(e: Enemy, count: number): Vec[] {
  const [cx, cy] = enemyCenter(e);
  const step = SHARD_LOOK.w + SHARD_LOOK.gap;
  return Array.from({ length: count }, (_, i): Vec => [cx + (i - (count - 1) / 2) * step, cy - 1]);
}

/** one shard: a small crystal diamond lit from the top left, a dark rim, a white glint and a faint light */
export function drawShard(x: number, y: number): void {
  const hw = SHARD_LOOK.w / 2;
  const hh = SHARD_LOOK.h / 2;
  const top: Vec = [x, y - hh];
  const right: Vec = [x + hw, y];
  const bottom: Vec = [x, y + hh];
  const left: Vec = [x - hw, y];
  const mid: Vec = [x, y];
  polygon([top, mid, left], P[4]);
  polygon([top, right, mid], P[3]);
  polygon([left, mid, bottom], P[3]);
  polygon([mid, right, bottom], P[2]);
  hairline(right[0], right[1], bottom[0], bottom[1], P[1]);
  hairline(bottom[0], bottom[1], left[0], left[1], P[1]);
  fleck(x - 0.5, y - hh + 1, WHITE);
  glow(x, y, 6, P[3], 0.22);
}
