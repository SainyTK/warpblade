import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { FORGE } from "../../colors";
import { drawCoalmite } from "./draw";
import { updateCoalmite } from "./moves";

export const coalmiteKind: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 7, e.y - e.ay - 9, e.x + 7, e.y - e.ay],
  center: (e) => [e.x, e.y - e.ay - 5],
  rest: "walk",
  firstCooldown: () => 0.9,
  rift: { height: 10, y: () => GROUND, riftY: () => GROUND - 8 },
  update: updateCoalmite,
  draw: drawCoalmite,
  glow: { radius: 12, color: FORGE.molten[1], eyeY: -1 },
  orbs: 1,
  heartChance: 0.04,
};
