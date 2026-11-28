import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { VEIL } from "../colors";
import { updateFacetseer } from "./behavior";
import { drawFacetseer } from "./draw";

export const facetseer: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 9, e.y - 11, e.x + 9, e.y + 11],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(1.2, 2),
  rift: { height: 16, y: () => rng.range(40, 90), riftY: (y) => y },
  update: updateFacetseer,
  draw: drawFacetseer,
  glow: { radius: 24, color: VEIL.prism[3], eyeY: 0 },
  evades: true,
  orbs: 2,
  heartChance: 0.2,
};
