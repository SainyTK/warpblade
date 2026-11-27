import { GROUND } from "../../../../constants/stage";
import { VOID } from "../../../../game/enemies/abyss/colors";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { shroudTakes } from "../shroud";
import { updateHollowsquire } from "./behavior";
import { drawHollowsquire } from "./draw";

export const hollowsquire: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 7, e.y - 30, e.x + 8, e.y],
  center: (e) => [e.x, e.y - 16],
  rest: "walk",
  firstCooldown: () => 1.1,
  rift: { height: 19, y: () => GROUND, riftY: () => GROUND - 16 },
  update: updateHollowsquire,
  draw: drawHollowsquire,
  glow: { radius: 16, color: VOID[3], eyeY: -27 },
  guardFrom: 1,
  takes: shroudTakes,
  orbs: 2,
  heartChance: 0.15,
};
