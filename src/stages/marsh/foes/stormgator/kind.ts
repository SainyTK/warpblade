import { GROUND } from "../../../../constants/stage";
import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import { RAIN_FOES } from "../../../../game/enemies/rain/colors";
import { rng } from "../../../../game/state";
import { updateStormgator } from "./behavior";
import { GATOR_ARMOR, GATOR_REACH } from "./constants";
import { drawStormgator } from "./draw";
import { bodySpan } from "./frame";
import { bracing, rushing } from "./timing";

export const stormgator: EnemyKind = {
  flies: false,
  box: (e) => {
    const [x0, x1] = bodySpan(e.x, e.face, GATOR_REACH.back, GATOR_REACH.front);
    return [x0, e.y - GATOR_REACH.tall, x1, e.y];
  },
  center: (e) => [e.x + e.face * 6, e.y - 13],
  rest: "walk",
  firstCooldown: () => rng.range(1.2, 1.8),
  rift: { height: 22, y: () => GROUND, riftY: () => GROUND - 14 },
  update: updateStormgator,
  draw: drawStormgator,
  glow: { radius: 30, color: RAIN_FOES.wart, eyeY: -16 },
  takes: (e, dmg) => (bracing(e) ? dmg * GATOR_ARMOR : dmg),
  steady: rushing,
  orbs: 3,
  heartChance: 0.25,
};
