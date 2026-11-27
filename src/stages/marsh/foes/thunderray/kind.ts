import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { charging, updateThunderray } from "./behavior";
import { RAY_COLORS } from "./colors";
import { RAY } from "./constants";
import { drawThunderray } from "./draw";

export const thunderray: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 15, e.y - 9, e.x + 15, e.y + 9],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(1.2, 2),
  rift: { height: 20, y: () => rng.range(50, 90), riftY: (y) => y },
  update: updateThunderray,
  draw: drawThunderray,
  glow: { radius: 26, color: RAY_COLORS.vein, eyeY: -2 },
  takes: (e, dmg) => (charging(e) ? dmg * RAY.armour : dmg),
  steady: charging,
};
