import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { SKY_FOES } from "../colors";
import { drawSkyguard } from "./draw";
import { updateSkyguard } from "./update";

export const skyguard: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 7, e.y - 30, e.x + 8, e.y],
  center: (e) => [e.x, e.y - 15],
  rest: "walk",
  firstCooldown: () => 1.1,
  rift: { height: 18, y: () => GROUND, riftY: () => GROUND - 16 },
  update: updateSkyguard,
  draw: drawSkyguard,
  glow: { radius: 22, color: SKY_FOES.volt[2], eyeY: -12 },
  guardFrom: 1,
  orbs: 2,
  heartChance: 0.2,
};
