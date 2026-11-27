import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { FORGE } from "../../colors";
import { drawCinderdrake } from "./draw";
import { updateCinderdrake } from "./moves";

export const cinderdrakeKind: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 11, e.y - 10, e.x + 14, e.y + 6],
  center: (e) => [e.x + e.face * 2, e.y - 2],
  rest: "drift",
  firstCooldown: () => rng.range(1.4, 2.4),
  rift: { height: 18, y: () => rng.range(44, 80), riftY: (y) => y },
  update: updateCinderdrake,
  draw: drawCinderdrake,
  glow: { radius: 22, color: FORGE.molten[2], eyeY: -6 },
  orbs: 3,
  heartChance: 0.15,
};
