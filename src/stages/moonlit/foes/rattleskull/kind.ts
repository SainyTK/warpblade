import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { GRAVE } from "../graveColors";
import { drawRattleskull } from "./draw";
import { updateRattleskull } from "./moves";

export const rattleskull: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 5, e.y - 10, e.x + 5, e.y],
  center: (e) => [e.x, e.y - 5],
  rest: "walk",
  firstCooldown: () => rng.range(0.8, 1.4),
  rift: { height: 10, y: () => GROUND, riftY: () => GROUND - 6 },
  update: updateRattleskull,
  draw: drawRattleskull,
  glow: { radius: 9, color: GRAVE.ghost[1], eyeY: -6 },
  orbs: 1,
};
