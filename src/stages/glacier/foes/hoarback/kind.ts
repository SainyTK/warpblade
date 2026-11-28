import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { FOE } from "../colors";
import { updateHoarback } from "./behavior";
import { drawHoarback } from "./draw";

export const hoarback: EnemyKind = {
  flies: false,
  box: (e) => (e.face > 0 ? [e.x - 13, e.y - 20, e.x + 16, e.y] : [e.x - 16, e.y - 20, e.x + 13, e.y]),
  center: (e) => [e.x + e.face * 2, e.y - 10],
  rest: "walk",
  firstCooldown: () => 1.2,
  rift: { height: 16, y: () => GROUND, riftY: () => GROUND - 12 },
  update: updateHoarback,
  draw: drawHoarback,
  glow: { radius: 20, color: FOE.crystal[2], eyeY: -8 },
  guardFrom: 1,
  orbs: 2,
  heartChance: 0.12,
};
