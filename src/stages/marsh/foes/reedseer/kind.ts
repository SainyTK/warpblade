import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { RAIN_FOES } from "../../../../game/enemies/rain/colors";
import { rng } from "../../../../game/state";
import { updateReedseer } from "./behavior";
import { drawReedseer } from "./draw";

export const reedseer: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 7, e.y - 34, e.x + 7, e.y],
  center: (e) => [e.x, e.y - 18],
  rest: "walk",
  firstCooldown: () => rng.range(1, 1.6),
  rift: { height: 20, y: () => GROUND, riftY: () => GROUND - 17 },
  update: updateReedseer,
  draw: drawReedseer,
  glow: { radius: 20, color: RAIN_FOES.wart, eyeY: -31 },
  orbs: 2,
  heartChance: 0.2,
};
