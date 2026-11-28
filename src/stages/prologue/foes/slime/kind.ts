import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { SLIME_COLORS } from "./colors";
import { drawSlime } from "./draw";
import { updateSlime } from "./moves";

export const slime: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 6, e.y - 8, e.x + 6, e.y],
  center: (e) => [e.x, e.y - 4],
  rest: "walk",
  firstCooldown: () => rng.range(0.8, 1.4),
  rift: { height: 8, y: () => GROUND, riftY: () => GROUND - 5 },
  update: updateSlime,
  draw: drawSlime,
  glow: { radius: 12, color: SLIME_COLORS.gel[3], eyeY: -4 },
  orbs: 1,
  heartChance: 0.04,
};
