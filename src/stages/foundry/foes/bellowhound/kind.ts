import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { FORGE } from "../../colors";
import { drawBellowhound } from "./draw";
import { updateBellowhound } from "./moves";

export const bellowhoundKind: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 12, e.y - 21, e.x + 14, e.y],
  center: (e) => [e.x + e.face * 2, e.y - 12],
  rest: "walk",
  firstCooldown: () => 1.2,
  rift: { height: 16, y: () => GROUND, riftY: () => GROUND - 12 },
  update: updateBellowhound,
  draw: drawBellowhound,
  glow: { radius: 20, color: FORGE.molten[2], eyeY: -6 },
  orbs: 2,
  heartChance: 0.12,
};
