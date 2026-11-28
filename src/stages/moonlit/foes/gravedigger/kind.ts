import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { GRAVE } from "../graveColors";
import { drawGravedigger } from "./draw";
import { updateGravedigger } from "./moves";

export const gravedigger: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 7, e.y - 25, e.x + 8, e.y],
  center: (e) => [e.x, e.y - 13],
  rest: "walk",
  firstCooldown: () => 1.2,
  rift: { height: 16, y: () => GROUND, riftY: () => GROUND - 13 },
  update: updateGravedigger,
  draw: drawGravedigger,
  glow: { radius: 14, color: GRAVE.ghost[1], eyeY: -21 },
  guardFrom: 1,
  orbs: 2,
  heartChance: 0.12,
};
