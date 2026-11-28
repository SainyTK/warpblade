import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { WASP_COLORS } from "./colors";
import { drawAmberwasp } from "./draw";
import { updateAmberwasp } from "./moves";

export const amberwasp: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 9, e.y - 7, e.x + 9, e.y + 7],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(1, 1.8),
  rift: { height: 14, y: () => rng.range(40, 90), riftY: (y) => y },
  update: updateAmberwasp,
  draw: drawAmberwasp,
  glow: { radius: 18, color: WASP_COLORS.amber[3], eyeY: -2 },
  orbs: 2,
  heartChance: 0.12,
};
