import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { updateMoldmite } from "./behavior";
import { MITE } from "./colors";
import { drawMoldmite } from "./draw";

export const moldmite: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 6, e.y - 9, e.x + 7, e.y],
  center: (e) => [e.x, e.y - 5],
  rest: "walk",
  firstCooldown: () => rng.range(0.8, 1.4),
  rift: { height: 9, y: () => GROUND, riftY: () => GROUND - 7 },
  update: updateMoldmite,
  draw: drawMoldmite,
  glow: { radius: 12, color: MITE.fuzz[2], eyeY: -4 },
  orbs: 1,
  heartChance: 0.05,
};
