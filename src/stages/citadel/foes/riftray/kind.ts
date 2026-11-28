import { VOID } from "../../../../game/enemies/abyss/colors";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { shroudTakes } from "../shroud";
import { updateRiftray } from "./behavior";
import { drawRiftray } from "./draw";

export const riftray: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 11, e.y - 5, e.x + 11, e.y + 5],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(1, 1.8),
  rift: { height: 14, y: () => rng.range(40, 90), riftY: (y) => y },
  update: updateRiftray,
  draw: drawRiftray,
  glow: { radius: 20, color: VOID[3], eyeY: -1 },
  takes: shroudTakes,
  orbs: 2,
};
