import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { updateHoarwraith } from "./behavior";
import { WRAITH_COLORS } from "./colors";
import { drawHoarwraith } from "./draw";

export const hoarwraith: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 8, e.y - 20, e.x + 8, e.y + 14],
  center: (e) => [e.x, e.y - 4],
  rest: "drift",
  firstCooldown: () => rng.range(1.1, 1.8),
  rift: { height: 20, y: () => rng.range(46, 90), riftY: (y) => y },
  update: updateHoarwraith,
  draw: drawHoarwraith,
  glow: { radius: 22, color: WRAITH_COLORS.shroud[3], eyeY: -14 },
  evades: true,
  orbs: 2,
  heartChance: 0.12,
};
