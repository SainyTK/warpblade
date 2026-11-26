import { GROUND } from "../../../constants/stage";
import type { EnemyKind } from "../../../game/enemies/kinds/kind";
import { rng } from "../../../game/state";
import { drawBogleech } from "./drawBogleech";
import { LEECH_COLORS } from "./leechColors";
import { buried, leechBox, leechCenter, updateBogleech } from "./leechMoves";

export const bogleech: EnemyKind = {
  flies: false,
  box: leechBox,
  center: leechCenter,
  rest: "walk",
  firstCooldown: () => rng.range(0.8, 1.4),
  rift: { height: 10, y: () => GROUND, riftY: () => GROUND - 8 },
  update: updateBogleech,
  draw: drawBogleech,
  glow: { radius: 16, color: LEECH_COLORS.rift, eyeY: -2 },
  takes: (e, dmg) => (buried(e) ? 0 : dmg),
  steady: buried,
  orbs: 2,
  heartChance: 0.2,
};
