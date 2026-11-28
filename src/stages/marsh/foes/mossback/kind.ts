import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { RAIN_FOES } from "../../../../game/enemies/rain/colors";
import { rng } from "../../../../game/state";
import { updateMossback } from "./behavior";
import { drawMossback } from "./draw";
import { airborne, mossbackBox, mossbackCenter } from "./moves";

export const mossback: EnemyKind = {
  flies: false,
  box: mossbackBox,
  center: mossbackCenter,
  rest: "walk",
  firstCooldown: () => rng.range(1, 1.6),
  rift: { height: 16, y: () => GROUND, riftY: () => GROUND - 12 },
  update: updateMossback,
  draw: drawMossback,
  glow: { radius: 20, color: RAIN_FOES.wart, eyeY: -6 },
  guardFrom: 1,
  guarding: (e) => e.state === "walk",
  steady: airborne,
  orbs: 2,
  heartChance: 0.2,
};
