import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { FORGE } from "../../colors";
import { drawSparkfly } from "./draw";
import { updateSparkfly } from "./moves";

export const sparkflyKind: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 6, e.y - 5, e.x + 6, e.y + 4],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(0.8, 1.6),
  rift: { height: 10, y: () => rng.range(50, 100), riftY: (y) => y },
  update: updateSparkfly,
  draw: drawSparkfly,
  glow: { radius: 14, color: FORGE.molten[3], eyeY: -1 },
  orbs: 1,
  heartChance: 0.04,
};
