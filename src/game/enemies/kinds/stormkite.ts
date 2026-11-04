import { rng } from "../../state";
import { RAIN_FOES } from "../rain/colors";
import { drawStormkite } from "../rain/drawStormkite";
import { updateStormkite } from "../rain/stormkite";
import type { EnemyKind } from "./kind";

/** the Storm Kite of the rain: glides over Kael and calls a violet bolt straight down onto a marked spot */
export const stormkite: EnemyKind = {
  flies: true,
  box: (e) => [e.x - 8, e.y - 9, e.x + 8, e.y + 8],
  center: (e) => [e.x, e.y],
  rest: "drift",
  firstCooldown: () => rng.range(1, 2),
  rift: { height: 12, y: () => rng.range(40, 90), riftY: (y) => y },
  update: updateStormkite,
  draw: drawStormkite,
  glow: { radius: 16, color: RAIN_FOES.kiteVein, eyeY: -1 },
};
