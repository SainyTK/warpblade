import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { GRAVE } from "../graveColors";
import { drawKeenwraith } from "./draw";
import { updateKeenwraith } from "./moves";

export const keenwraith: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 7, e.y - 12, e.x + 7, e.y + 10],
  center: (e) => [e.x, e.y - 2],
  rest: "drift",
  firstCooldown: () => rng.range(1.4, 2),
  rift: { height: 16, y: () => rng.range(40, 80), riftY: (y) => y },
  update: updateKeenwraith,
  draw: drawKeenwraith,
  glow: { radius: 16, color: GRAVE.veil[1], eyeY: -6 },
  evades: true,
  orbs: 2,
  heartChance: 0.15,
};
