import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { rng } from "../../../../game/state";
import { updateVoltfly } from "./behavior";
import { VOLTFLY_COLORS } from "./colors";
import { drawVoltfly } from "./draw";

export const voltfly: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 13, e.y - 7, e.x + 13, e.y + 6],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(1, 1.8),
  rift: { height: 12, y: () => rng.range(60, 110), riftY: (y) => y },
  update: updateVoltfly,
  draw: drawVoltfly,
  glow: { radius: 18, color: VOLTFLY_COLORS.vein, eyeY: -1 },
  evades: true,
};
