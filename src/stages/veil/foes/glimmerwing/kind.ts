import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { VEIL } from "../colors";
import { updateGlimmerwing } from "./behavior";
import { drawGlimmerwing } from "./draw";

export const glimmerwing: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 6, e.y - 5, e.x + 6, e.y + 5],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(0.6, 1.4),
  rift: { height: 9, y: () => rng.range(50, 100), riftY: (y) => y },
  update: updateGlimmerwing,
  draw: drawGlimmerwing,
  glow: { radius: 12, color: VEIL.prism[3], eyeY: -1 },
  orbs: 1,
  heartChance: 0.04,
};
