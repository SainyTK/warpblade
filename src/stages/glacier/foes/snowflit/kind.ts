import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { FOE } from "../colors";
import { updateSnowflit } from "./behavior";
import { drawSnowflit } from "./draw";

export const snowflit: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 5, e.y - 5, e.x + 5, e.y + 4],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(0.8, 1.6),
  rift: { height: 9, y: () => rng.range(50, 100), riftY: (y) => y },
  update: updateSnowflit,
  draw: drawSnowflit,
  glow: { radius: 11, color: FOE.crystal[2], eyeY: -2 },
  orbs: 1,
  heartChance: 0.04,
};
