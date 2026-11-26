import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { SKY_FOES } from "../colors";
import { drawGalehawk } from "./draw";
import { updateGalehawk } from "./update";

export const galehawk: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 9, e.y - 7, e.x + 9, e.y + 6],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(1, 2),
  rift: { height: 13, y: () => rng.range(40, 90), riftY: (y) => y },
  update: updateGalehawk,
  draw: drawGalehawk,
  glow: { radius: 16, color: SKY_FOES.volt[2], eyeY: -2 },
};
