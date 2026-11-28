import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { FOE } from "../colors";
import { wardedTakes } from "../lampWard";
import { updateHushwarden } from "./behavior";
import { drawHushwarden } from "./draw";

export const hushwarden: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 10, e.y - 54, e.x + 10, e.y],
  center: (e) => [e.x, e.y - 28],
  rest: "walk",
  firstCooldown: () => 1.6,
  rift: { height: 34, y: () => GROUND, riftY: () => GROUND - 28 },
  update: updateHushwarden,
  draw: drawHushwarden,
  glow: { radius: 28, color: FOE.eye, eyeY: -49 },
  guardFrom: 1,
  guarding: (e) => e.state === "walk",
  takes: wardedTakes,
  orbs: 4,
  heartChance: 0.2,
};
