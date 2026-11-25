import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { FOE } from "../colors";
import { updateShardling } from "./behavior";
import { drawShardling } from "./draw";

export const shardling: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 6, e.y - 10, e.x + 6, e.y + 10],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(0.9, 1.8),
  rift: { height: 13, y: () => rng.range(40, 100), riftY: (y) => y },
  update: updateShardling,
  draw: drawShardling,
  glow: { radius: 16, color: FOE.crystal[2], eyeY: -1 },
};
