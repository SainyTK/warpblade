import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { FOE } from "../colors";
import { wardedTakes } from "../lampWard";
import { updateInkling } from "./behavior";
import { drawInkling } from "./draw";

export const inkling: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 7, e.y - 13, e.x + 7, e.y],
  center: (e) => [e.x, e.y - 6],
  rest: "walk",
  firstCooldown: () => 1.1,
  rift: { height: 12, y: () => GROUND, riftY: () => GROUND - 10 },
  update: updateInkling,
  draw: drawInkling,
  takes: wardedTakes,
  glow: { radius: 16, color: FOE.inkSheen, eyeY: -2 },
  orbs: 2,
  heartChance: 0.12,
};
