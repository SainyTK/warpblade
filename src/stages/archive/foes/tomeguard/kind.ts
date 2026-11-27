import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { FOE } from "../colors";
import { wardedTakes } from "../lampWard";
import { updateTomeguard } from "./behavior";
import { drawTomeguard } from "./draw";

export const tomeguard: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 8, e.y - 34, e.x + 8, e.y],
  center: (e) => [e.x, e.y - 18],
  rest: "walk",
  firstCooldown: () => 1.4,
  rift: { height: 22, y: () => GROUND, riftY: () => GROUND - 18 },
  update: updateTomeguard,
  draw: drawTomeguard,
  takes: wardedTakes,
  glow: { radius: 18, color: FOE.eye, eyeY: -13 },
  guardFrom: 1,
  guarding: (e) => e.state === "walk",
  orbs: 3,
  heartChance: 0.15,
};
