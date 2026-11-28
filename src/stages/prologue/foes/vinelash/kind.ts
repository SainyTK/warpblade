import { GROUND } from "../../../../constants/stage";
import { DAY_COLORS } from "../../../../game/enemies/day/colors";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { drawVinelash } from "./draw";
import { updateVinelash } from "./moves";

export const vinelash: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 10, e.y - 26, e.x + 10, e.y],
  center: (e) => [e.x, e.y - 13],
  rest: "walk",
  firstCooldown: () => 1.1,
  rift: { height: 16, y: () => GROUND, riftY: () => GROUND - 14 },
  update: updateVinelash,
  draw: drawVinelash,
  glow: { radius: 20, color: DAY_COLORS.crack, eyeY: -14 },
  orbs: 2,
  heartChance: 0.15,
};
