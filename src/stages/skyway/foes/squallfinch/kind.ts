import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { SKY_FOES } from "../colors";
import { drawSquallfinch } from "./draw";
import { updateSquallfinch } from "./moves";

export const squallfinch: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 6, e.y - 5, e.x + 6, e.y + 4],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(0.8, 1.6),
  rift: { height: 9, y: () => rng.range(50, 100), riftY: (y) => y },
  update: updateSquallfinch,
  draw: drawSquallfinch,
  glow: { radius: 10, color: SKY_FOES.volt[2], eyeY: -2 },
};
