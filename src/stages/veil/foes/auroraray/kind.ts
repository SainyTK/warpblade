import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { VEIL } from "../colors";
import { updateAuroraray } from "./behavior";
import { drawAuroraray } from "./draw";

export const auroraray: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 13, e.y - 5, e.x + 13, e.y + 5],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(1, 1.8),
  rift: { height: 14, y: () => rng.range(50, 90), riftY: (y) => y },
  update: updateAuroraray,
  draw: drawAuroraray,
  glow: { radius: 22, color: VEIL.aurora[2], eyeY: -1 },
  orbs: 2,
  heartChance: 0.15,
};
