import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { BLIGHT } from "../../colors";
import { bloatTakes } from "./armor";
import { updateBloatcap } from "./behavior";
import { drawBloatcap } from "./draw";

export const bloatcap: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 14, e.y - 14, e.x + 14, e.y + 10],
  center: (e) => [e.x, e.y - 3],
  rest: "drift",
  firstCooldown: () => rng.range(1.2, 2),
  rift: { height: 22, y: () => rng.range(50, 80), riftY: (y) => y },
  update: updateBloatcap,
  draw: drawBloatcap,
  glow: { radius: 26, color: BLIGHT.spore[2], eyeY: 1 },
  takes: bloatTakes,
  orbs: 3,
  heartChance: 0.2,
};
