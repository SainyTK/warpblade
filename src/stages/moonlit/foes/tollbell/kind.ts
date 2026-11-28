import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { GRAVE } from "../graveColors";
import { drawTollbell } from "./draw";
import { updateTollbell } from "./moves";

export const tollbell: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 9, e.y - 11, e.x + 9, e.y + 9],
  center: (e) => [e.x, e.y - 1],
  rest: "drift",
  firstCooldown: () => rng.range(1.6, 2.2),
  rift: { height: 16, y: () => rng.range(36, 70), riftY: (y) => y },
  update: updateTollbell,
  draw: drawTollbell,
  glow: { radius: 18, color: GRAVE.moon[2], eyeY: 4 },
  orbs: 3,
  heartChance: 0.2,
};
