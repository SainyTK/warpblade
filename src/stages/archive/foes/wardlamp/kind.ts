import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { FOE } from "../colors";
import { wardedTakes } from "../lampWard";
import { updateWardlamp } from "./behavior";
import { drawWardlamp } from "./draw";

export const wardlamp: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 7, e.y - 12, e.x + 7, e.y + 11],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(1.4, 2.2),
  rift: { height: 16, y: () => rng.range(80, 104), riftY: (y) => y },
  update: updateWardlamp,
  draw: drawWardlamp,
  glow: { radius: 26, color: FOE.flame[2], eyeY: 0 },
  takes: wardedTakes,
  orbs: 2,
  heartChance: 0.15,
};
