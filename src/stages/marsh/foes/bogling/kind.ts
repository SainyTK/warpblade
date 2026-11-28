import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { RAIN_FOES } from "../../../../game/enemies/rain/colors";
import { rng } from "../../../../game/state";
import { updateBogling } from "./behavior";
import { drawBogling } from "./draw";

export const bogling: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 6, e.y - 10, e.x + 6, e.y],
  center: (e) => [e.x, e.y - 5],
  rest: "walk",
  firstCooldown: () => rng.range(0.8, 1.4),
  rift: { height: 8, y: () => GROUND, riftY: () => GROUND - 6 },
  update: updateBogling,
  draw: drawBogling,
  glow: { radius: 10, color: RAIN_FOES.wart, eyeY: -5 },
  orbs: 1,
  heartChance: 0.05,
};
