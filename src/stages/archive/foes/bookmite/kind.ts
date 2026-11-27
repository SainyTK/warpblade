import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { FOE } from "../colors";
import { wardedTakes } from "../lampWard";
import { updateBookmite } from "./behavior";
import { drawBookmite } from "./draw";

export const bookmite: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 7, e.y - 10, e.x + 7, e.y],
  center: (e) => [e.x, e.y - 5],
  rest: "walk",
  firstCooldown: () => 0.9,
  rift: { height: 9, y: () => GROUND, riftY: () => GROUND - 6 },
  update: updateBookmite,
  draw: drawBookmite,
  glow: { radius: 10, color: FOE.eye, eyeY: -6 },
  takes: wardedTakes,
  orbs: 1,
};
