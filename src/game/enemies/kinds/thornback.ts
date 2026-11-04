import { GUARD } from "../../../constants/combat";
import { GROUND } from "../../../constants/stage";
import { DAY_COLORS } from "../day/colors";
import { drawThornback } from "../day/drawThornback";
import { updateThornback } from "../day/thornback";
import type { EnemyKind } from "./kind";

/** the Thornback of the day: a bramble boar that paws the floor, then charges in a straight line and stands winded */
export const thornback: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 12, e.y - 18, e.x + 12, e.y],
  center: (e) => [e.x, e.y - 9],
  rest: "walk",
  firstCooldown: () => 1.2,
  rift: { height: 13, y: () => GROUND, riftY: () => GROUND - 11 },
  update: updateThornback,
  draw: drawThornback,
  glow: { radius: 20, color: DAY_COLORS.crack, eyeY: 0 },
  guardFrom: GUARD.fromWave,
  staggers: true,
  orbs: 2,
  heartChance: 0.2,
};
