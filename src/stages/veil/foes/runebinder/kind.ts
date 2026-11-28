import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { VEIL } from "../colors";
import { updateRunebinder } from "./behavior";
import { drawRunebinder } from "./draw";

export const runebinder: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 9, e.y - 32, e.x + 9, e.y],
  center: (e) => [e.x, e.y - 16],
  rest: "walk",
  firstCooldown: () => 1.2,
  rift: { height: 20, y: () => GROUND, riftY: () => GROUND - 17 },
  update: updateRunebinder,
  draw: drawRunebinder,
  glow: { radius: 22, color: VEIL.rune[2], eyeY: -26 },
  guardFrom: 1,
  guarding: (e) => e.state === "walk",
  orbs: 2,
  heartChance: 0.2,
};
