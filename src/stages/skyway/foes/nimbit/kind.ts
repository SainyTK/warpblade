import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { SKY_FOES } from "../colors";
import { drawNimbit } from "./draw";
import { updateNimbit } from "./moves";

export const nimbit: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 6, e.y - 13, e.x + 6, e.y],
  center: (e) => [e.x, e.y - 7],
  rest: "walk",
  firstCooldown: () => rng.range(0.6, 1.2),
  rift: { height: 10, y: () => GROUND, riftY: () => GROUND - 8 },
  update: updateNimbit,
  draw: drawNimbit,
  glow: { radius: 10, color: SKY_FOES.volt[2], eyeY: -7 },
};
