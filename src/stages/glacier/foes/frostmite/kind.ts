import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { FOE } from "../colors";
import { updateFrostmite } from "./behavior";
import { drawFrostmite } from "./draw";

export const frostmite: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 6, e.y - 10, e.x + 6, e.y],
  center: (e) => [e.x, e.y - 5],
  rest: "walk",
  firstCooldown: () => rng.range(0.6, 1.2),
  rift: { height: 9, y: () => GROUND, riftY: () => GROUND - 6 },
  update: updateFrostmite,
  draw: drawFrostmite,
  glow: { radius: 12, color: FOE.crystal[2], eyeY: -5 },
  orbs: 1,
  heartChance: 0.04,
};
