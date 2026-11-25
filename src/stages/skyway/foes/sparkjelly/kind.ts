import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { SKY_FOES } from "../colors";
import { drawSparkjelly } from "./draw";
import { updateSparkjelly } from "./update";

export const sparkjelly: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 8, e.y - 9, e.x + 8, e.y + 8],
  center: (e) => [e.x, e.y - 1],
  rest: "drift",
  firstCooldown: () => rng.range(1.2, 2.2),
  rift: { height: 14, y: () => rng.range(50, 100), riftY: (y) => y },
  update: updateSparkjelly,
  draw: drawSparkjelly,
  glow: { radius: 20, color: SKY_FOES.bell[3], eyeY: -1 },
  glowRadius: (e) => (e.state === "wind" || e.state === "beam" ? 28 : 20),
};
