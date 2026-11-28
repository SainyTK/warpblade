import { VOID } from "../../../../game/enemies/abyss/colors";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { shroudTakes } from "../shroud";
import { updateRiftmote } from "./behavior";
import { drawRiftmote } from "./draw";

export const riftmote: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 6, e.y - 5, e.x + 6, e.y + 5],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(0.8, 1.6),
  rift: { height: 9, y: () => rng.range(50, 100), riftY: (y) => y },
  update: updateRiftmote,
  draw: drawRiftmote,
  glow: { radius: 10, color: VOID[3], eyeY: -1 },
  takes: shroudTakes,
};
