import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { FORGE } from "../../colors";
import { updateEmberbat } from "./behavior";
import { drawEmberbat } from "./draw";

export const emberbatKind: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 8, e.y - 6, e.x + 8, e.y + 5],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(1, 2),
  rift: { height: 12, y: () => rng.range(40, 90), riftY: (y) => y },
  update: updateEmberbat,
  draw: drawEmberbat,
  glow: { radius: 16, color: FORGE.molten[2], eyeY: -3 },
};
