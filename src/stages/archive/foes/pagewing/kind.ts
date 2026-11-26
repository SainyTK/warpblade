import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { FOE } from "../colors";
import { updatePagewing } from "./behavior";
import { drawPagewing } from "./draw";

export const pagewing: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 8, e.y - 7, e.x + 8, e.y + 5],
  center: (e) => [e.x, e.y - 1],
  rest: "drift",
  firstCooldown: () => rng.range(0.9, 1.8),
  rift: { height: 12, y: () => rng.range(96, 118), riftY: (y) => y },
  update: updatePagewing,
  draw: drawPagewing,
  glow: { radius: 14, color: FOE.paper[3], eyeY: -2 },
};
