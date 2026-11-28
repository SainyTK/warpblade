import { GROUND } from "../../../../constants/stage";
import { VOID } from "../../../../game/enemies/abyss/colors";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { shroudTakes } from "../shroud";
import { updateEclipseknight } from "./behavior";
import { drawEclipseknight } from "./draw";

export const eclipseknight: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 9, e.y - 44, e.x + 11, e.y],
  center: (e) => [e.x, e.y - 24],
  rest: "walk",
  firstCooldown: () => 1.3,
  rift: { height: 26, y: () => GROUND, riftY: () => GROUND - 22 },
  update: updateEclipseknight,
  draw: drawEclipseknight,
  glow: { radius: 24, color: VOID[3], eyeY: -40 },
  guardFrom: 1,
  takes: shroudTakes,
  orbs: 3,
  heartChance: 0.2,
};
