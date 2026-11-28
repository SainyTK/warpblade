import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { GRAVE } from "../graveColors";
import { drawWickling } from "./draw";
import { updateWickling } from "./moves";

export const wickling: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 4, e.y - 8, e.x + 4, e.y + 6],
  center: (e) => [e.x, e.y - 1],
  rest: "drift",
  firstCooldown: () => rng.range(1, 1.6),
  rift: { height: 10, y: () => rng.range(60, 100), riftY: (y) => y },
  update: updateWickling,
  draw: drawWickling,
  glow: { radius: 12, color: GRAVE.ghost[1], eyeY: -2 },
  orbs: 1,
};
