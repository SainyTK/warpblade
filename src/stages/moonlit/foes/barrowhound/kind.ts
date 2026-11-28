import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { GRAVE } from "../graveColors";
import { drawBarrowhound } from "./draw";
import { updateBarrowhound } from "./moves";

export const barrowhound: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 11, e.y - 15, e.x + 13, e.y],
  center: (e) => [e.x + 1, e.y - 9],
  rest: "walk",
  firstCooldown: () => rng.range(1, 1.6),
  rift: { height: 14, y: () => GROUND, riftY: () => GROUND - 9 },
  update: updateBarrowhound,
  draw: drawBarrowhound,
  glow: { radius: 16, color: GRAVE.fire[1], eyeY: -12 },
  evades: true,
  orbs: 2,
  heartChance: 0.15,
};
