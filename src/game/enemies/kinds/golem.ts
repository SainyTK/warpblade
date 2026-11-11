import { GUARD } from "../../../constants/combat";
import { GROUND } from "../../../constants/stage";
import { RUNE_RAMP } from "../twilight/colors";
import { drawGolem } from "../twilight/drawGolem";
import { updateGolem } from "../twilight/golem";
import type { EnemyKind } from "./kind";

/** the Rune Golem of the twilight: a slow stone guard that punches up close and slams rune waves along the floor */
export const golem: EnemyKind = {
  flies: false,
  box: (e) => [e.x - 10, e.y - 24, e.x + 10, e.y],
  center: (e) => [e.x, e.y - 12],
  rest: "walk",
  firstCooldown: () => 1.2,
  rift: { height: 16, y: () => GROUND, riftY: () => GROUND - 14 },
  update: updateGolem,
  draw: drawGolem,
  glow: { radius: 22, color: RUNE_RAMP[1], eyeY: -11 },
  guardFrom: GUARD.fromWave,
  orbs: 2,
  heartChance: 0.2,
};
