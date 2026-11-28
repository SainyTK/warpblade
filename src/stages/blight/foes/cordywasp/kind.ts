import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { updateCordywasp } from "./behavior";
import { WASP } from "./colors";
import { drawCordywasp } from "./draw";

export const cordywasp: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 11, e.y - 8, e.x + 9, e.y + 8],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(1.2, 2),
  rift: { height: 14, y: () => rng.range(50, 95), riftY: (y) => y },
  update: updateCordywasp,
  draw: drawCordywasp,
  glow: { radius: 18, color: WASP.bulb[2], eyeY: -2 },
  evades: true,
};
