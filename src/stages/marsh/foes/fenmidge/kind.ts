import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { RAIN_FOES } from "../../../../game/enemies/rain/colors";
import { rng } from "../../../../game/state";
import { updateFenmidge } from "./behavior";
import { drawFenmidge } from "./draw";

export const fenmidge: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 6, e.y - 5, e.x + 6, e.y + 4],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(0.9, 1.6),
  rift: { height: 8, y: () => rng.range(60, 110), riftY: (y) => y },
  update: updateFenmidge,
  draw: drawFenmidge,
  glow: { radius: 9, color: RAIN_FOES.kiteVein, eyeY: 0 },
  orbs: 1,
  heartChance: 0.05,
};
