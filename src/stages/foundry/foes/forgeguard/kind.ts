import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { FORGE } from "../../colors";
import { updateForgeguard } from "./behavior";
import { drawForgeguard } from "./draw";

export const forgeguardKind: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 8, e.y - 28, e.x + 8, e.y],
  center: (e) => [e.x, e.y - 14],
  rest: "walk",
  firstCooldown: () => 1.4,
  rift: { height: 18, y: () => GROUND, riftY: () => GROUND - 15 },
  update: updateForgeguard,
  draw: drawForgeguard,
  glow: { radius: 20, color: FORGE.molten[2], eyeY: -9 },
  guardFrom: 1,
  orbs: 2,
  heartChance: 0.2,
};
