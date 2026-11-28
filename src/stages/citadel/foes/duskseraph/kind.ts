import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { ECLIPSE } from "../colors";
import { updateDuskseraph } from "./behavior";
import { drawDuskseraph } from "./draw";

export const duskseraph: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 7, e.y - 24, e.x + 7, e.y + 12],
  center: (e) => [e.x, e.y - 8],
  rest: "drift",
  firstCooldown: () => rng.range(1.2, 2),
  rift: { height: 22, y: () => rng.range(36, 70), riftY: (y) => y - 6 },
  update: updateDuskseraph,
  draw: drawDuskseraph,
  glow: { radius: 24, color: ECLIPSE[3], eyeY: -25 },
  evades: true,
  orbs: 3,
  heartChance: 0.2,
};
