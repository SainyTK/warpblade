import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { VEIL } from "../colors";
import { updateGlintmite } from "./behavior";
import { drawGlintmite } from "./draw";

export const glintmite: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 6, e.y - 10, e.x + 6, e.y],
  center: (e) => [e.x, e.y - 5],
  rest: "walk",
  firstCooldown: () => 0.8,
  rift: { height: 9, y: () => GROUND, riftY: () => GROUND - 7 },
  update: updateGlintmite,
  draw: drawGlintmite,
  glow: { radius: 12, color: VEIL.crystal[2], eyeY: -4 },
  orbs: 1,
  heartChance: 0.04,
};
