import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import { rng } from "../../../game/state";
import { drawLanternshade } from "./drawLanternshade";
import { SHADE_COLORS } from "./shadeColors";
import { updateLanternshade } from "./shadeMoves";

export const lanternshade: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 7, e.y - 12, e.x + 7, e.y + 9],
  center: (e) => [e.x, e.y - 2],
  rest: "drift",
  firstCooldown: () => rng.range(1, 1.8),
  rift: { height: 14, y: () => rng.range(40, 90), riftY: (y) => y },
  update: updateLanternshade,
  draw: drawLanternshade,
  glow: { radius: 14, color: SHADE_COLORS.flame, eyeY: -5 },
};
