import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { BAT_COLORS } from "./colors";
import { drawBat } from "./draw";
import { updateBat } from "./moves";

export const bat: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 6, e.y - 5, e.x + 6, e.y + 4],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(1, 1.8),
  rift: { height: 10, y: () => rng.range(50, 95), riftY: (y) => y },
  update: updateBat,
  draw: drawBat,
  glow: { radius: 12, color: BAT_COLORS.eye, eyeY: -3 },
  orbs: 1,
  heartChance: 0.04,
};
